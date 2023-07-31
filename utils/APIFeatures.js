class APIFeatures {
  constructor(query, queryObject) {
    this.query = query; // QUERY FOR EXECUTION
    this.queryObject = queryObject; // QUERY FROM CLIENT => req.query
  }

  filter() {
    const queryObj = { ...this.queryObject };
    // console.log('queryObject', queryObj);
    const excludedField = ['page', 'sort', 'limit', 'fields'];

    excludedField.forEach((e) => delete queryObj[e]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    // console.log('queryStr', queryStr);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      // How to chain multiple sort => query.sort("name duration requestAt")
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //using skip and limit
    const page = this.queryObject.page * 1 || 1;
    const limit = this.queryObject.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
