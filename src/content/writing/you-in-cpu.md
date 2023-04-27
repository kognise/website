---
title: Putting the "You" in CPU
abstract: Test
date: '2023-04-12'
draft: true
slug: you-in-cpu--delist
---

*nb: these intro paragraphs need a big rewrite.*

I've done a lot of things with computers, but I've always had a gap in my knowledge— what exactly happens when I run a program on my computer? I kept feeling like I had most of the requisite knowledge, but just couldn't piece everything together. Are programs executing through the OS? Directly on the CPU? Something else? What even *is* a syscall?

A couple days ago I cracked and decided to go all-in on figuring out as much as possible. Several days of research and almost 30 pages of notes later, I think I have a much better idea of how things work! I would've killed for one solid article explaining everything, so I'm writing what I wished I had.

And you know what they say... you only truly understand something if you can explain it to someone else.

## Part 1: The "Basics"

something something intro intro, i was surprised by how simple some of this stuff is. lorem ipsum dolor sit amet blah blah blah.

intro intro reassure readers that the basic stuff (like describing what a cpu is) at the start isn't the whole article.

### How Computers Are Architected

The *central processing unit* (CPU) of a computer is in charge of all computation. It's the big cheese. The shazam alakablam. It starts chugging as soon as you start your computer, executing instruction after instruction after instruction.

An "instruction" is just a bunch of binary data: a byte or two to represent what instruction is being run, followed by whatever data is needed to run the instruction. What we call *machine code* is a bunch of instructions in a row. Assembly is a representation of machine code that's easier to read and write than raw bits.

<img style='max-width: 400px;' src='https://doggo.ninja/HAWs0S.png' width='1038' height='560' />

> An aside: instructions aren't always represented 1:1 in machine code like the above example. For example, `add eax, 512` translates to `05 00 02 00 00`.
> 
> The first byte (`05`) is an opcode specifically representing *adding EAX to a 16-bit number*. The remaining bytes are 512 (`0x200`) in [little-endian](https://en.wikipedia.org/wiki/Endianness) byte order.
>
> Defuse offers [a helpful tool](https://defuse.ca/online-x86-assembler.htm) for playing around with the translation between assembly and machine code.

RAM is your computer's main memory bank, a large multi-purpose space which, among other things, is where the CPU fetches machine code from. The CPU stores an *instruction pointer* which points to where in RAM it's going to fetch the next instruction from. After executing each instruction, the CPU either increments this pointer or jumps somewhere else, and repeats. This is the *fetch-execute cycle*.

This instruction pointer is stored in a *register*. Registers are small but very fast storage buckets. Each CPU architecture has a fixed set of registers, used for everything from storing temporary values during computations to configuring the processor.

Some registers are directly accessible from machine code, like `ebx` in the earlier diagram.

Other registers are only used internally by the CPU, but can often be controlled via specialized instructions. One example is the instruction pointer which can't be read directly but can be updated with, for example, a jump instruction.

### Processors Are Naive

Let's go back to the original question: what happens when you run an executable file on your computer? First, a bunch of magic happens to prepare the execution— we’ll figure all of that out later— but at the end of the process there’s machine code in a file somewhere. The operating system loads this into RAM and instructs the CPU to jump its instruction pointer to the start. The CPU runs its fetch-execute cycle as normal, so the program executes.

<img style='max-width: 400px;' src='https://doggo.ninja/CuKAdU.png' width='935' height='372' />

It turns out CPUs have a super basic worldview; they only see the current instruction pointer and a bit of internal state. Processes are entirely operating system abstractions, not something CPUs natively understand or keep track of.

*\*waves hands\* processes are abstractions made up by os devs to sell more computers*

For me, this raises more questions than it answers:

1. If the CPU doesn’t know about multiprocessing and just executes instructions sequentially, why doesn’t it get stuck inside whatever program it’s running? How can multiple programs run at once?
2. If programs run directly on the CPU, and the CPU can directly access RAM, why can't code access memory from other processes, or, god forbid, the kernel?
3. Speaking of which, what's the mechanism that prevents every process from running any instruction and doing anything to your computer? AND WHAT'S A DAMN SYSCALL?

The memory question is more complicated than you might expect— most memory accesses actually go through layers of misdirection that remap the entire address space. For now, I'm going to pretend programs can access RAM directly and computers can only run one process at once.

It's time to leap through our first rabbit hole into a land filled with syscalls and security rings.

### Two Rings to Rule Them All

The *mode* (sometimes called privilege level or ring) a processor is in controls what it's allowed to do. Modern architectures have at least two options— kernel/supervisor mode and user mode. While an architecture might support more than two modes, only kernel mode and user mode are commonly used these days.

In kernel mode, anything goes: the CPU is allowed to execute any supported instruction and access any memory. In user mode, a small subset of instructions is allowed, I/O and memory access is limited, and many CPU settings are locked. Generally, operating systems and drivers run in kernel mode while applications run in user mode.

<img style='max-width: 500px; margin: 0 auto;' src='https://doggo.ninja/rRrSIk.png' width='1072' height='433' />

An example of how processor modes manifest in a real architecture: x86-64 stores a two-bit IOPL field in the FLAGS register. IOPL stands for "I/O privilege level" and is the x86-64 internal name for the current privilege mode/ring. Since there are two bits, it supports 4 rings numbered 0-3: ring 0 is kernel mode and ring 3 is user mode. Rings 1 and 2 are designed for running drivers but are only used by a handful of older niche operating systems. If the IOPL bits are `10`, for example, the CPU is in ring 2.
 
### What Even is a Syscall?

Programs run in user mode because they can't be trusted with full access to the computer. User mode does its job and prevents access to most of the computer. But programs *somehow* need to be able to access I/O, allocate memory, and interact with the operating system! To do so, software running in user mode has to ask the operating system kernel for help. The OS can then implement its own security protections to prevent programs from doing anything malicious.

If you've ever written code that interacts with the OS, you'll probably recognize functions like `open`, `read`, `fork`, and `exit`. At the lowest level, these are all *system calls*; the way programs can ask the OS for help. A system call is a special procedure that lets a program start a transition from user space to kernel space, jumping from the program's code into OS code.

User space to kernel space control transfers are accomplished using a processor feature called *software interrupts*:

1. During initialization, the operating system registers a table called an *interrupt vector table* (interrupt descriptor table on x86-64). The IVT maps interrupt numbers to handler code pointers.
  <img style='max-width: 250px; margin: 0 auto;' src='https://doggo.ninja/lmiysV.png' width='471' height='463' />
2. Then, userland programs can use an instruction like [INT](https://www.felixcloutier.com/x86/intn:into:int3:int1) which tells the processor to switch to kernel mode and jump to the IVT handler for the given interrupt number.

When the kernel is done with its business, it switches back to user mode and returns the instruction pointer to where it was when the interrupt was triggered. This is accomplished with an instruction like [IRET](https://www.felixcloutier.com/x86/iret:iretd:iretq).

(If you were curious, the standard interrupt id for syscalls is `0x80` on Linux.)

#### Wrapper APIs: Abstracting Away Interrupts

Here's what we know so far about system calls:

- User mode programs can't access I/O or memory directly. They have to ask the OS for help interacting with the outside world.
- Programs can delegate control to the OS with special machine code instructions like INT and IRET.
- Programs can't directly switch privilege levels; hardware interrupts are safe because the processor has been preconfigured *by the OS* with where in the OS code to jump to. The interrupt vector table can only be configured from kernel mode.

Programs need to pass data to the operating system when triggering a syscall; the OS needs to know which specific system call to execute alongside any data the syscall itself needs, for example, what filename to open. The mechanism for passing this data varies by operating system and architecture, but it's usually done by placing data in certain registers or on the stack before triggering the interrupt.

The variance in how system calls are called across devices means it would be wildly impractical for programmers to implement system calls themselves for every program. This would also mean operating systems couldn't change their interrupt handling for fear of breaking every program that was written to use the old system. Finally, we typically don't write programs in raw assembly anymore... programmers can't be expected to drop down to assembly any time they want to read a file or allocate memory.

[Illustration: CPU receiving binary on the left and giving a FD. Different CPU receiving same binary on the right and looking really confused.]

So, operating systems provide an abstraction layer on top of these interrupts. Reusable higher-level library functions that wrap the necessary assembly instructions are provided by libc on Unix-like systems and part of a library called `ntdll.dll` on Windows. Calls to these library functions themselves don't cause switches to kernel mode, they're just standard function calls. Inside the libraries, assembly code does actually transfer control to the kernel, and is a lot more platform-dependent than the wrapping library subroutine.

When you call `exit(1)` from C running on a Unix-like system, that function is internally running machine code to trigger an interrupt, after placing the system call's opcode and arguments in the right registers/stack/whatever. Computers are so cool!

### The Need for Speed / Let's Get CISC-y

Many [CISC](https://en.wikipedia.org/wiki/Complex_instruction_set_computer) architectures like x86-64 contain instructions designed for system calls, created due to the prevalence of the system call paradigm.

Intel and AMD managed not to coordinate very well on x86-64; it actually has *two* sets of optimized system call instructions. [SYSCALL](https://www.felixcloutier.com/x86/syscall.html) and [SYSENTER](https://www.felixcloutier.com/x86/sysenter) are optimized alternatives to instructions like `INT 0x80`. Their corresponding return instructions, [SYSRET](https://www.felixcloutier.com/x86/sysret.html) and [SYSEXIT](https://www.felixcloutier.com/x86/sysexit), are designed to quickly transition back to user space and resume program code.

(AMD and Intel processors have slightly different compatibility with these instructions. `SYSCALL` is generally the best option for 64-bit programs, while `SYSENTER` has better support with 32-bit programs.)

As is typical, [RISC](https://en.wikipedia.org/wiki/Reduced_instruction_set_computer) architectures tend not to have such special instructions. AArch64, the RISC architecture Apple Silicon is based on, uses only [one interrupt instruction](https://developer.arm.com/documentation/ddi0596/2021-12/Base-Instructions/SVC--Supervisor-Call-) for syscalls and software interrupts alike. I think Mac users are doing fine&nbsp;:)

---

Whew, that was a lot! Let's do a brief recap:

- Processors execute instructions in an infinite fetch-execute loop and don't have any concept of operating systems or programs. The mode the processor is in, usually stored in a register, determines what instructions may be executed. Operating system code runs in kernel mode and switches to user mode to run programs.
- To run a binary, the operating system switches to user mode and points the processor to the code's entry point in RAM. Because they only have the privileges of user mode, programs that want to interact with the world need to jump to OS code for help. System calls are a standardized way for programs to switch from user mode to kernel mode and into OS code.
- Programs typically use these syscalls by calling shared library functions. These wrap machine code for either software interrupts or architecture-specific syscall instructions that transfer control to the OS kernel and switch rings. The kernel does its business and switches back to user mode and returns to the program code.

Let’s figure out how to answer my first question from earlier

> If the CPU doesn't keep track of more than one process and just executes instruction after instruction, why doesn't it get stuck inside whatever program it's running? How can multiple programs run at once?

The answer to this, my dear friend, is also the answer to why Coldplay is so popular... clocks! (Well, technically timers. I just wanted to shoehorn that joke in.)

## Part 2: Slice Dat Time

Let's say you're building an operating system and you want users to be able to run multiple programs at once. You don’t have a fancy multi-core processor though, so your CPU can only run one instruction at a time!

Luckily, you’re a very smart OS developer. You figure out that you can fake concurrency by letting processes take turns on the CPU. If you cycle through the processes and run a couple instructions from each one, they can all be responsive without any single process hogging the CPU.

How do you take control back from program code? After a bit of research, you discover that most computers come with timer chips. You can program a timer chip to trigger a switch to an OS interrupt handler after a certain amount of time passes.

### **Hardware Interrupts**

Earlier, we talked about how software interrupts are used to hand control from a userland program to the OS. These are called “software” interrupts because they’re voluntarily triggered by a program— machine code executed by the processor in the normal fetch-execute cycle tells it to switch control to the kernel.

The counterpart to software interrupts are *hardware interrupts*: external chips and hardware devices can send a message to the CPU to stop what it’s doing and switch to the registered interrupt handler. Hardware interrupts are integral to a lot of systems we take for granted; when you press a key on a keyboard, that triggers a hardware interrupt so the OS can handle the keypress. The handlers for hardware interrupts are typically stored in the same interrupt vector table as software interrupts.

<img style='max-width: 500px; margin: 0 auto;' src='https://doggo.ninja/xG5REv.png' width='935' height='503' />

OS schedulers use *timer chips* like [PITs](https://en.wikipedia.org/wiki/Programmable_interval_timer) to trigger hardware interrupts for multitasking:

1. Before jumping to program code, the OS sets the timer chip to trigger an interrupt after some period of time.
2. The OS switches to user mode and jumps to the next instruction of the program.
3. When the timer elapses, it triggers a hardware interrupt to switch to kernel mode and jump to OS code.
4. The OS can now save where the program left off, load a different program, and repeat the process.

This is called *preemptive multitasking*; the interruption of a process is called *preemption*. If you’re, say, reading this article on a browser and also listening to music, your very own computer is probably following this cycle.

### Timeslice Calculation

A *timeslice* (or quantum) is the duration an OS scheduler allows a process to run for before preempting it. The simplest way to pick timeslices is to give every process the same timeslice, perhaps in the 10&nbsp;ms range, and cycle through tasks in order. This is called *fixed timeslice round-robin* scheduling.

A slight improvement to fixed timeslice scheduling is to pick a *target latency*— the ideal longest time for a process to respond. The target latency should be equal to the time it takes for a process to resume execution after being preempted. Timeslices are calculated by dividing the target latency by the total number of tasks; this is better than fixed timeslice scheduling because it eliminates wasteful task switching with fewer processes. With a target latency of 15&nbsp;ms and 10 processes, each process would get 15/10 or 1.5&nbsp;ms to run. With only 3 processes, each process gets a longer 5&nbsp;ms timeslice while still hitting the target latency.

Process switching is computationally expensive because it requires saving the entire state of the current program and restoring a different one. Past a certain threshold, too small of a calculated timeslice can result in worse performance than having a longer fixed timeslice. It's common to have a fixed timeslice that serves as a lower bound when there are many processes. At the time of this article, Linux's scheduler uses a target latency of 6&nbsp;ms and a minimum granularity of 0.75&nbsp;ms.

<img style='max-width: 500px; margin: 0 auto;' src='https://doggo.ninja/6oIiif.png' width='953' height='433' />

Round-robin scheduling with this basic timeslice calculation is close to what most computers do nowadays. It's still a bit naive; most operating systems tend to have more complex schedulers which take process priorities and deadlines into account. Since 2007, Linux has used a scheduler called "Completely Fair Scheduler". CFS does a bunch of very fancy computer science things to prioritize tasks and divvy up CPU time.

Every time the OS preempts a process it needs to load the new program's saved execution context, including its memory environment. This is accomplished by telling the CPU to use a different *page table*, the mapping from "virtual" to physical addresses. This is also the system that prevents programs from accessing each other's memory; we'll figure it out in-depth in part 5 of this article.

### Note #1: Kernel Preemptability

So far, we've been only talking about the preemption and scheduling of userland processes. Kernel code might make programs feel laggy if it took too long handling a syscall or executing driver code.

Modern kernels, including the Linux kernel, are preemptive. This means they're programmed in a way that allows kernel code itself to be interrupted and scheduled just like userland processes.

This isn't very important to know about unless you're writing a kernel or something, but basically every article I've read has mentioned it so I thought I would too! Extra knowledge is rarely a bad thing.

### Note #2: A History Lesson

Ancient operating systems, including classic Mac OS and versions of Windows long before NT, used a predecessor to preemptive multitasking. Rather than the OS deciding when to preempt programs, the programs themselves would choose to yield to the OS. They would trigger a software interrupt to say, "hey, you can let another program run now". These explicit yields were the only way for the OS to regain control and switch to the next scheduled process.

This is called *cooperative multitasking*. It has a couple major flaws: malicious or just poorly designed programs can easily freeze the entire operating system, and it's nigh impossible to ensure temporal consistency for realtime/time-sensitive tasks. For these reasons, the tech world switched to preemptive multitasking a long time ago and never looked back.

## To be continued...
