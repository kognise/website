import fauna from 'faunadb'

const q = fauna.query
const client = new fauna.Client({ secret: process.env.FAUNA_SECRET })

export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  try {
    const email = req.query.email
    const name = req.query.name


    if (!email || !name) {
      res.statusCode = 400
      return res.end(JSON.stringify({
        error: 'Please specify both a name and email.'
      }))
    }

    const subscriberResults = await client.query(
      q.Paginate(q.Match(
        q.Index('subscriber_by_email'),
        email
      ))
    )

    if (subscriberResults.data.length > 0) {
      res.statusCode = 409
      return res.end(JSON.stringify({
        error: 'It looks like you\'ve already subscribed to the newsletter.'
      }))
    }

    await client.query(
      q.Create(
        q.Collection('subscribers'),
        {
          data: { email, name }
        }
      )
    )

    res.statusCode = 200
    return res.end(JSON.stringify({
      error: false
    }))
  } catch (error) {
    res.statusCode = 500
    return res.end(JSON.stringify({
      error: error.message
    }))
  }
}