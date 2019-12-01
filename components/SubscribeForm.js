import { useState } from 'react'
import RippleLoader from './RippleLoader'

const useFormField = () => {
  const [value, setValue] = useState('')
  const valueHandler = (event) => setValue(event.target.value)
  return [value, valueHandler]
}

export default () => {
  const [name, nameListener] = useFormField()
  const [email, emailListener] = useFormField()
  const [state, setState] = useState('pending')
  const [error, setError] = useState(null)

  let content = null

  if (state === 'pending') {
    const submit = async (event) => {
      event.preventDefault()
      setState('loading')

      const res = await fetch(`/api/subscribe?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`)
      const json = await res.json()
      if (json.error) setError(json.error)
      setState('done')
    }

    content = <form onSubmit={submit}>
      <label htmlFor='subscribe-name'>Name</label>
      <input
        type='text'
        name='name'
        id='subscribe-name'
        placeholder='Kognise'
        value={name}
        onChange={nameListener}
        required
      />

      <label htmlFor='subscribe-email'>Email</label>
      <input
        type='email'
        name='email'
        id='subscribe-email'
        placeholder='hi@kognise.dev'
        value={email}
        onChange={emailListener}
        required
      />

      <button type='submit'>
        Subscribe
      </button>

      <style jsx>{`
        label, input {
          display: block;
          width: 100%;
        }
        
        input, button {
          padding: 12px 20px;
          font-size: inherit;
          font-family: inherit;
        }

        label, button {
          font-weight: bold;
        }

        input {
          margin-bottom: 16px;
          border: 1px solid #cccccc;
          box-sizing: border-box;
        }

        button {
          background: #000000;
          color: #ffffff ;
          border: none;
          cursor: pointer;
        }

        button:hover {
          text-decoration: underline;
        }

        ::placeholder {
          color: #b8b8b8;
        }
      `}</style>
    </form>
  } else if (state === 'loading') {
    content = <RippleLoader />
  } else if (state === 'done') {
    content = <p>
      {error
        ? <><strong>Oh no!</strong> {error}</>
        : 'Done! Thanks for subscribing.'}

      <style jsx>{`
        p {
          max-width: 250px;
          margin: 0 auto;
          margin-top: 60px;
        }
      `}</style>
    </p>

  }

  return <div>
    <h2>Subscribe</h2>
    <p>Get an email when I post something new. I promise, no spam.</p>

    {content}

    <style jsx>{`
      h2, p {
        margin: 0;
      }

      h2 {
        font-size: 1.5em;
        margin-bottom: 10px;
      }

      p {
        color: #505050;
        margin-bottom: 20px;
      }

      div {
        max-width: 520px;

        margin: 0 auto;
        margin-bottom: 80px;
        margin-top: 60px;
      }
    `}</style>
  </div>
}