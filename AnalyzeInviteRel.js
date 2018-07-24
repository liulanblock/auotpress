//@flow
const { Client } = require('pg')
const logger = require('./AnalyzeLogger');
const conString = "tcp://postgres:etz.123456@localhost/blockoptions"
const table_name = 'etz_recommend_record';

var m = {};

async function fillMap() {
  var client = new Client(conString)
  await client.connect()
  var res = await client.query("SELECT lower(phone_address) AS phone_address, lower(recommend_address) AS recommend_address FROM " +table_name + " where type='推荐奖励' AND status='已激活'")
  console.log(res.rows[1])
  for (var index = 0; index < res.rows.length; index++) {
    m[res.rows[index].phone_address] = {pre: res.rows[index].recommend_address, count: 0}
    if (res.rows[index].recommend_address && !m[res.rows[index].recommend_address]) {
      m[res.rows[index].recommend_address] = {pre: null, count: 0}
    }
  }
  console.log(res.rows.length)
}

async function analyzeMap() {
  for (var address in m) {
    console.log(address)
    var curAddr = address
    while (m[curAddr].pre) {
      curAddr = m[curAddr].pre
      m[curAddr].count += 1
    }
  }
  console.log('finish analyze')
}

async function start(){
  await fillMap()
  await analyzeMap()
  for (var address in m) {
    console.log(address)
    logger.info(address + ':' + m[address].count)
  }
  process.exit(0)
}

start()
