/*global expect:true*/

'use strict';

const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 1000,
});

const wrapper = (method) => {
  return (...args) => {
    const httpRequest = client[method](...args).then(({status, data}) => {
      return {status, data};
    });

    return {
      sends: {
        ok: (data) => {
          const status = 200;
          return httpRequest.should.eventually.become({status, data});
        },
        badRequest: (data) => {
          return httpRequest.catch(({response}) => {
            expect(response.status).to.equal(400);
            expect(response.data).to.deep.equal(data);
          });
        },
      }
    };
  };
};

['get', 'put', 'patch'].forEach(method => {
  global[method] = wrapper(method);
});
