let options = [ 'sim',
    'gdax.BTC-USD',
    '--strategy',
    'forex_analytics',
    '--disable_options',
    '--modelfile',
    '/home/highlander/.fomobro/temp.571132ce3df3aeea6415aafce5b5e326c9b374cec182af5cf7c2c23982b6af0c-20190820_041537+0000.json',
    '--start',
    '201908192215',
    '--end',
    '201908192200',
    '--period',
    '30m',
    '--filename',
    'home/highlander/.fomobro/temp.571132ce3df3aeea6415aafce5b5e326c9b374cec182af5cf7c2c23982b6af0c-20190820_041537+0000.json-simTrainingResult.html' ]


console.log(options.toString().replace(/,/g, ' '))
