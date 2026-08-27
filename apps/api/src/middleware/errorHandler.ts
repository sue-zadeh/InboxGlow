import type { ErrorRequestHandler, RequestHandler } from 'express'

export const notFound: RequestHandler = (_request, response) => {
  response.status(404).json({ error: 'Route not found' })
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next
  console.error(error)
  response.status(500).json({ error: 'Unexpected server error' })
}
