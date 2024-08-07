const db = require('../models/db');

const getBooks = async ({ offset = 0, limit = 10, q, sort, fields, ...filters }) => {
  const offsetNum = parseInt(offset);
  const limitNum = parseInt(limit);

  let searchQuery = {};
  if (q) {
    searchQuery = {
      $or: [
        { "books.title": { $regex: q, $options: 'i' } },
        { "books.author": { $regex: q, $options: 'i' } },
        { "books.tags": { $regex: q, $options: 'i' } }
      ]
    };
  }

  const filterQuery = Object.keys(filters).length ? { "books": { $elemMatch: filters } } : {};

  const query = {
    ...searchQuery,
    ...filterQuery
  };

  let sortQuery = {};
  if (sort) {
    sort.split(',').forEach(s => {
      const [key, order = 'asc'] = s.split(':');
      sortQuery[key] = order === 'asc' ? 1 : -1;
    });
  } else {
    // If no sort parameter is provided, set a default sort order
    sortQuery = { "books.title": 1 }; // Sorting by title in ascending order by default
  }

  let projectQuery = {};
  if (fields) {
    fields.split(',').forEach(field => {
      projectQuery[`books.${field}`] = 1;
    });
  }

  const pipeline = [
    { $match: query },
    { $unwind: "$books" },
    { $match: filters },
    { $sort: sortQuery },
    { $skip: offsetNum },
    { $limit: limitNum }
  ];

  if (fields) {
    pipeline.push({ $project: projectQuery });
  }

  const results = await db.collection("books").aggregate(pipeline).toArray();

  const totalBooks = await db.collection("books").aggregate([
    { $match: query },
    { $unwind: "$books" },
    { $match: filters },
    { $count: "total" }
  ]).toArray();

  const total = totalBooks[0] ? totalBooks[0].total : 0;

  const pagination = {
    page: Math.floor(offsetNum / limitNum) + 1,
    limit: limitNum,
    pages: Math.ceil(total / limitNum),
    total,
    next: (offsetNum + limitNum) < total ? (Math.floor(offsetNum / limitNum) + 2) : null,
    prev: offsetNum > 0 ? (Math.floor(offsetNum / limitNum)) : null
  };

  return { results: results.map(result => result.books), pagination };
};

module.exports = {
  getBooks
};
