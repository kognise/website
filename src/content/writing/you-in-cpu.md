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

<img style='max-width: 500px; margin: 0 auto;' src='https://doggo.ninja/C9ENjY.png' width='1072' height='433' />

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



---

First of all, I would appreciate a compliment on the fact that I refrained from using the word "quantum" in every sentence in the last article, and instead stuck with the more accessible "timeslice". In other jargon, Linux kernel devs are awesome and invented the time unit "jiffies" to count fixed-Hz ticks.

So far, we've covered how executables contain machine code, how CPUs execute that machine code, and how ring-based security works. This final article in the series will cover how the programs are loaded and run in the first place and go deeper into how paging and virtual memory works.

## Part 3: The Double-Click

For this section, I'm going to talk specifically about Linux on x86-64 environments. The mechanisms on other operating systems and architectures are very similar and much of the same knowledge should apply. Why?

- Linux is a fully-featured OS for desktop, mobile, and server use cases so functions as a great reference. It's open source, so super easy to research; to write this article I read a bunch of code from the Linux kernel, and I will link to some of it.
- x86-64 is the architecture that most modern desktop computers use and is what a lot of code targets. I think the subset of x86-64-specific behavior I mention will generalize well.

Let's start with a very important syscall: `execve`. It loads a program and (if successful) replaces the current process with that program. There are a couple other syscalls (`execlp`, `execvpe`, etc.), but they all layer on top of `execve` in various fashions.

### Basic Behavior of `execve`

The call signature of `execve` is:

```c
int execve(const char *pathname, char *const argv[], char *const envp[]);
```

The `pathname` argument specifies a path to the program to run.

`argv` is a null-terminated (meaning the last item is a null pointer) list of arguments to the program. The `argc` argument you'll commonly seen passed to C main functions is actually calculated later by the syscall, thus the null-termination.

Fun fact! You know that convention for the program name to be the first argument? That's purely a convention and isn't set by the syscall itself. Whatever is passed as the first item in the `argv` argument to `execve` will be the first argument, even if it's nothing to do with the program name. It's actually weirdly assumed that the first argument will be the program name during script execution, more on this later.

The `envp` argument contains another null-terminated list of environment variables used as context for the application. They're... conventionally `KEY=VALUE` pairs. *Conventionally.* I love computers.

#### Step 0: Definition

Since we already know the basics how syscalls work, let's quickly look at where `execve` is defined in the first place. I'm not going to go in depth but it can be fun to see what happens underneath the hood!

Linux kernel source, `fs/exec.c`:

```c
SYSCALL_DEFINE3(execve,
	const char __user *, filename,
	const char __user *const __user *, argv,
	const char __user *const __user *, envp)
{
	return do_execve(getname(filename), argv, envp);
}
```

`SYSCALL_DEFINE3` is a helper macro which abstracts over creating a 3-argument system call. Apparently Linux's syscall definition macros have hardcoded arity (cool word!) in their name because that's required to prevent some random kernel vulnerability.

The `getname()` function is defined in `fs/namei.c`, it copies the file name from user space to kernel space, returning a `filename` struct. You can see this struct defined in `include/linux/fs.h`; it includes the original string pointer in user space and the new pointer to the value copied to kernel space:

```c
struct filename {
	const char *name; /* pointer to actual string */
	const __user char *uptr; /* original userland pointer */
	int refcnt;
	struct audit_names *aname;
	const char iname[];
};
```

Back to the syscall definition, you can see it calls the internal `do_execve()` function. This, in turn, calls `do_execveat_common()`. In the below snippet, I've also included the definition of `do_execveat()`, another syscall which lets you run `execve` in a directory beside the current working directory:

```c
static int do_execve(struct filename *filename,
	const char __user *const __user *__argv,
	const char __user *const __user *__envp)
{
	struct user_arg_ptr argv = { .ptr.native = __argv };
	struct user_arg_ptr envp = { .ptr.native = __envp };
	return do_execveat_common(AT_FDCWD, filename, argv, envp, 0);
}

static int do_execveat(int fd, struct filename *filename,
		const char __user *const __user *__argv,
		const char __user *const __user *__envp,
		int flags)
{
	struct user_arg_ptr argv = { .ptr.native = __argv };
	struct user_arg_ptr envp = { .ptr.native = __envp };
	
	return do_execveat_common(fd, filename, argv, envp, flags);
}
```
\[sic\]

Notice that in the definition for `execveat`, a file descriptor (basically an id that points to *some resource*) pointing to the directory is passed through from the syscall. In `execve`, a special value is used instead, `AT_FDCWD`. This is a shared constant in the Linux kernel that generally tells functions to interpret pathnames as relative to the current working directory. This means functions that accept file descriptors often include a manual check like `if (fd == AT_FDCWD)` that leads to a special codepath.

We're now at `do_execveat_common`, which starts by setting up a `linux_binprm` struct. I'm going to stop at  with source code specifics and step back to a slightly more abstract perspective.

#### Step 1: Setup

So, the first major order of business of the `execve` syscall is setting up a struct called `linux_binprm`. I won't include the whole struct definition, but it's nice to know a couple of the things that are included and initialized:

- Data structures including `mm_struct` and `vm_area_struct` which are used to set up future virtual memory management for the new program.
- `argc` and `envc` to be passed to the program. This is where those are calculated like I mentioned earlier.
- Some metadata, including `filename` and `interp`. Initially these are the same, but occasionally the binary being *executed* is different from the name of the file which was run by the user. One case of this is when interpreted programs (think Python) specify their interpreter in a shebang.
- An array, `buf`, filled with the first 256 bytes of the file to be executed. This is used to detect the format of the file.

(What does binprm stand for? Binary program, apparently.)

#### Step 2: Binfmts

Let's look at this buffer. Its length is specifically defined as the constant `BINPRM_BUF_SIZE`. Searching the codebase for this we can find a definition in `include/uapi/linux/binfmts.h`:

```c
/* sizeof(linux_binprm->buf) */
#define BINPRM_BUF_SIZE 256
```

So, the kernel loads the first 256 bytes of the file into memory. Next, the kernel iterates through a bunch of handlers defined in files like `fs/binfmt_elf.c`, `fs/binfmt_flat.c`, etcetera. Each of these handlers exposes a `load_binary()` method which is passed a `linux_binprm` struct. The handlers check the beginning of the file loaded into the buffer to see if they know how to handle the format, and either prepare the file for execution and return a success code or return an error code. The kernel keeps trying `load_binary()` functions for various `binfmt`s until it reaches one that succeeds. This might also have to run recursively; for example, a script interpreter which is a script itself.

#### Format Highlight: Scripts

Of the many formats Linux supports, `binfmt_script` is the first I want to specifically mention. You know shebangs, sometimes called hashbangs? The line at the start of interpreted files that specifies the path to the program that can interpret them?

```py
#!/bin/bash
```

I always just assumed these were handled by the shell, but no! These are special kernel behavior! Take a look at `fs/binfmt_script.c`:

```c
/* Not ours to exec if we don't start with "#!". */
if ((bprm->buf[0] != '#') || (bprm->buf[1] != '!'))
	return -ENOEXEC;
```

Next, it reads the interpreter path and any space-separated arguments passed to the interpreter, stopping when it hits a newline or the end of the buffer. Computers are so cool. There are actually two fun wonky things with this!

First of all, remember that buffer with the hardcoded length of 256? While I was researching for this I read an article that indicated it was 128. Curious, I checked the git blame— a log of who last edited a line of code— for the line where `BINPRM_BUF_SIZE` is defined in the Linux source code. Lo and behold...

![https://doggo.ninja/nHzI0U.png](https://doggo.ninja/nHzI0U.png)

I LOVE COMPUTERS! Since shebangs are handled by the kernel, and pull from that buffer, they're *always* truncated. And apparently, 4 years ago, someone got annoyed and their solution was just to double the truncation point from 128 characters to 256 by doubling the buffer size. Today, on your very own Linux machine, anything past 256 characters in a shebang line will be *completely disregarded*. Woe is the next massive-enterprise IT person who is hit with a confusing bug where part of their path just goes mysteriously missing.

The second wonky thing: remember how I said that it's purely *convention* for `argv[0]` to be the program name? How you can still pass anything to `execve`? Well, it just so happens that `binfmt_script` *assumes* `argv[0]` isn't important; it's always deleted. Afterward the shebang code adds the following to the start of `argv`:

- Path to the interpreter
- Interpreter arguments
- Script filename

So if the shebang is `#!/usr/bin/node --experimental-module` and the `argv` is `[ "A", "B", "C" ]`, the final args will be `[ "/usr/bin/node", "--experimental-module", "B", "C" ]`. Then the handler updates `linux_binprm.interp` to Node, and return 0 to indicate success.

#### Format Highlight: Miscellaneous Interpreters

Next, I wish to talk about `binfmt_misc`, a pretty interesting handler. It's fully configurable from userland through a special file system mounted at `/proc/sys/fs/binfmt_misc/`. This allows installed programs to add their own handlers, each configuration entry specifying:

- How to detect their file format. Can specify either a magic number at a certain offset, or a file extension.
- Path to an interpreter executable. The configuration doesn't provide a place for interpreter arguments, so a wrapper script is needed if those are desired.
- Various flags, including what to place in `argv`.

On my particular system, a `binfmt_misc` handler is configured so that Python bytecode (.pyc) is run by the appropriate program. This system is also often used with Java programs, detecting class files by their `0xCAFEBABE` magic bytes and jar files by extension.

### In The End

If you've ever used a Unix-like system, you might've noticed that if you execute a shell script it'll run correctly, even without a shebang line or `.sh` extension. If you're on macOS or Linux you can try it right now:

```
$ echo "echo hello" > ./file
$ chmod +x ./file
$ ./file
hello
```

(If you aren't familiar, `chmod +x` tells the OS a file is executable.)

So, why this behavior? Well, interestingly, it isn't part of the kernel. An exec syscall will always end up in one of two paths:

- It will eventually reach an executable binary format that it understands, perhaps after several layers of script interpreters, and run that code. At this point, the old code has been replaced.
- ... or it will exhaust all its options, tail between its legs, and return an error code to the calling program.

It turns out that if you execute a file in a Unix shell and the exec syscalls fail, most shells will *retry executing the file as a shell script.* Bash will typically use itself, while ZSH uses `sh` (usually Bourne shell). This behavior is so common because it's specified in *POSIX*, an old standard designed to make code portable between Unix systems. While POSIX isn't often strictly followed anymore, most Unix-like operating systems and tools follow many aspects:

> If \[the exec syscall\] fails due to an error equivalent to the ENOEXEC error, **the shell shall execute a command equivalent to having a shell invoked with the command name as its first operand**, with any remaining arguments passed to the new shell. If the executable file is not a text file, the shell may bypass this command execution. In this case, it shall write an error message and shall return an exit status of 126.
> 
> *Source: [Shell Command Language, POSIX](https://pubs.opengroup.org/onlinepubs/9699919799.2018edition/)*

Computers are so cool!

## Part 4: Becoming an Elf-Lord

In the last article, we talked about the `execve` syscall. At the end of most paths, the kernel will reach a final program containing machine code for it to launch. Typically, a setup process is required before actually jumping to the code— for example, global program memory has to be set up. Because of this, we use special file formats that specify all of this setup process. While Linux supports many, the most common format by far is *ELF* (executable and linkable format).

ELF binaries are handled by the `binfmt_elf` handler, which is more complex than many other handlers, containing many hundreds of lines of code. The process of loading an ELF file is generally as follows.

### Reading the Header

ELF files start with a header section containing non-executable information for loading the code. The kernel cares about two main pieces of the header.

The `PT_LOAD` header value points to data in the ELF binary to load into memory as static data. These loadable parts include:

- Machine code to be loaded into memory and executed on the CPU. `SHT_PROGBITS` type with the `SHF_EXECINSTR` flag to mark it as executable, and the `SHF_ALLOC` flag which just means it will be loaded into memory for execution.
- Initialized data hardcoded in the executable to be loaded into memory. If you write low-level code, this is where statics go. This is also `SHT_PROGBITS`; this section type just means "information for the program".  The flags are `SHF_ALLOC` and `SHF_WRITE` to mark it as writeable.
- Some other global data needs memory space but starts out empty— it would be a waste to include a bunch of empty bytes in the ELF file, so this is specified in a special section called *BSS* which only includes the length to be allocated. This is of type `SHT_NOBITS`, but also `SHF_ALLOC` and `SHF_WRITE`.

ELF headers also often include a `PT_INTERP` header which specifies a dynamic linking runtime. What... is... dynamic linking?

### A Brief Explanation of Linking 

Before we talk about *dynamic* linking, let's talk about linking in general. Programmers tend to build their programs on top of libraries of reusable code— libc, for example. When building a binary, all these references to external code need to be resolved so that code can be included in the binary. This process is called *static linking*.

However, some libraries are very common. You'll find libc is used by basically every program; it includes an interface for using syscalls! It would be a stupid use of space to include a separate copy of libc in every single program on your computer. Also, it might be nice if bugs in libraries could be fixed without recompiling and updating everything.  The solution to this is beloved dynamic linking.

Dynamically linked binaries leave out some of their dependencies, only including named pointers to the methods and libraries they need. These libraries are (hopefully) installed on the computer running the program, which *dynamically* loads the required code when the program is being run. This means if that library is changed, for example, that new code will be loaded the next time the program runs! No change in the program needed. These typically take the form of .so (Shared Object) files on Linux, .dll (Dynamic Link Library) files on Windows, and .dylib (DYnamically linked LIBrary) on macOS.

There is another important difference between static and dynamic linking. With static linking, only the portions of the library that are used are included in the executable and thus loaded into memory. With dynamic linking, the *entire library* is loaded into memory. This is because modern operating systems can save more than disk space with dynamic linking— they can share the *memory* of libraries as well. This only applies to code, since the library should be able to have different state for different processes, but those savings can still be substantial. However, this does mean the whole library has to be loaded; if only the used segments were loaded, internal references (jumps, for example) wouldn't line up if different segments were loaded non-contiguously by different processes.

### Execution

Let's hop on back to the kernel running ELF files: if the binary it's executing is dynamically linked, the OS can't just jump to the binary's code right away because there would be missing code. Instead, it needs to run a special program which will figure out what libraries are needed, load them, replace all the named pointers with actual jump instructions, and *then* start the actual program code. This loader might vary across systems, so its path (typically something like `/lib64/ld-linux-x86-64.so.2`) is specified by the ELF file in the `PT_INTERP` header field.

After reading the ELF header, the kernel has all the information it needs to set up the memory structure for the new program. It starts by loading the program's static data, BSS space, and machine code into memory. If the program is dynamically linked, the kernel has to run `PT_INTERP` first. In this case, it'll also load the ELF interpreter's data, BSS, and code into wherever it fits in memory.

Now the kernel needs to store the instruction pointer which will be restored when returning to userland. If this executable is dynamically linked, the kernel sets the instruction pointer to the start of the ELF interpreter's code in memory. Otherwise, the kernel sets it to the start of the executable.

About now is where the kernel pushes some `argc`, `argv`, and environment variables to the stack for the new process to handle.

Before handling a syscall, the kernel stores the current value of registers to the stack to be restored when switching back to user space. The kernel now zeroes this part of the stack and returns to user space. The registers are restored, emptied, and the kernel jumps to the stored instruction pointer which is now the starting point of the new program!

## Part 5: Let's Talk About Forks and Cows

Granular things to mention:
- Fork-exec pattern
- Physical vs virtual memory. Why virtual memory?
	- Protections/security - process isolation, kernel isolation
	- Pages have different levels of protection. On Linux kernel memory is top half but not accessible unless you're in ring 0. macOS doesn't do this, completely separate kernel and user space memory
	- Optimizations - mmapping, cows, shared libraries
- Paging
	- Page tables are in physical memory
	- Multiple levels. Why? Optimization, it's easy to share table levels between processes. Something something caching?
	- MMU is a thing that exists, integral part of computer architecture, intervenes
	- Base of the page table PDBR is set in CR3 register
	- Paging and virtual memory is a CPU-level thing. Enabled via CR0 register
- Let's look at this more practically. All your process are kinda like a tree. They fork-exec down the tree. But the first process can't be fork-execed, bit of a chicken egg problem.
	- Kernel boot up process
	- Creation of init process (which fork-execs everything else)
- How do cow and demand paging actually work? Page faults, interrupts, fun fact

- You might’ve noticed execve replaces the current process rather than creating a new one. So how do you create new processes? Well another syscall called fork which clones the current process.
- Cow. memory paging and structure of this. Demand paging. CR3 and MMU
- As [comment] says, memory management can be a bitch
- Malloc allocates in virtual heap space
- (not here? Stack expands down with demand paging)
- mmap, demand paging, shared libraries are loaded 

- How does cow actually work? Page faults interrupts!
- Something something kernel memory access in interrupts, init process

## Part 6: Epilogue

- ChatGPT acknowledgement
- Funny implications of unix is not meant to be shut down
- Two Rings to Rule Them All
