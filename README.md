# Weather Wrapper API using Redis for caching

This is a simple project that i build to learn use cache with **[Redis](https://redis.io/)**. He make requests for **[Visual Cross API](https://www.visualcrossing.com/weather-api)** and caching forecast on redis, getting better performance and reduce unnecessary request from external API (saving $)

## Features

This projects just have one fuction: **Get Forecast**, which:

- Consult specifc city forecast
- Use Redis to store and recovery already used forecasts
- Quickly response if forecast already stay in Redis cache

## Conclusion

In tests on my local machine, directly requests to external API took on **avarage 1500ms**, after store these same tests and use cache, the sames requests took **avarage 13ms**. Really, this is very important on a large scale.
