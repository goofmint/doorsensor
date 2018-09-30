$(function() {
  var data = [{
    label: 'Pressure',
    values: []
  }];
  for (var i = 0; i < 10; i += 1) {
    data[0].values.push({
      time: Date.now(),
      y: parseInt(Math.random() * 100)
    });
  }
  var g = $('#area').epoch({
    type: 'time.line',
    data: data
  });
  
  let config;
  $.getJSON({
    url: './config.json'
  })
  .then(data => {
    config = data;
    ECHO.initialize(
      config.domain,
      config.applicationId,
      config.applicationKey
    );
  })

  setInterval(() => {
    const time = new Date(Date.now() - 5000);
    const date = strftime('%F %T', time);
    ECHO.Databases.find(config.databaseInstanceId, {
      filter: {
        "created": {"$gte": date}
      }
    })
    .then(records => {
      console.log(records);
    });
  }, 3000); 
})
