const mongoose = require('mongoose');

mongoose.Query.prototype.paginate = function paginate(page, limit, cb) {
  let query = this;
  const { model } = this;
  let iLimit = parseInt(limit, 10);
  const iPage = parseInt(page, 10) || 1;

  iLimit = iLimit === 0 ? 0 : iLimit || 10;

  const skipFrom = (iPage * iLimit) - iLimit;

  query = query.skip(skipFrom).limit(limit);

  const promise = new Promise((resolve, reject) => {
    model.count(query._conditions, (err, total) => {
      if (err) reject(err);

      if (iPage !== 0 && total !== 0) {
        query.exec((error, docs) => {
          if (err) reject(err);
          resolve({ docs, total });
        });
      } else {
        resolve({ docs: [], total });
      }
    });
  });

  if (cb) {
    promise
    .then((res) => {
      const { docs, total } = res;
      return cb(null, docs, total);
    })
    .catch(err => cb(err, [], 0));
  }

  return promise;
};
