const Router = require('koa-router')
const R = require('ramda')
const { elasticsearch } = require('../services')
const router = new Router({ prefix: '/health' })

// use partial application to configure the `index` and `search` method
const defaultParams = { index: 'healthchecks', type: 'healthcheck' }
const client = elasticsearch.getElasticSearchClient()
const index = R.partial(elasticsearch.index, [defaultParams, client])
const search = R.partial(elasticsearch.search, [defaultParams, client])

/**
 * Health check endpoint, logs the request in
 * elasticsearch
 */
router.get('/', async (ctx, next) => {
  // log the healthcheck
  const date = new Date()
  const timestamp = Math.floor(date)
  const result = await index({
    id: `${timestamp}`,
    body: {
      healthcheck: 'OK',
      ip: ctx.request.ip,
      url: ctx.request.URL,
      timestamp: date
    }
  })
  ctx.status = 200
  ctx.body = { success: true, result }
})

/**
 * Weekly report endpoint, returns a weekly aggregate of healthchecks,
 * grouped by IP and URL
 */
router.get('/weekly-report', async (ctx, next) => {
  const result = await search({
    body: {
      // TODO: perform a weekly aggregate of healthchecks, grouped by IP and URL
    }
  })
  ctx.status = 200
  ctx.body = { success: true, result }
})

module.exports = router
