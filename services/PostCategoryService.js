const PostCategory = require("../models/PostCategory");

const add = async data => {
  try {
    const name = data.name;
    const nameExisted = await findByName(name);
    if (nameExisted) TEM("Đã có loại bài viết này");
    const postCategory = new PostCategory({ name });
    const result = await postCategory.save();
    return result;
  } catch (error) {
    throw error;
  }
};

const getAll = async () => {
  try {
    const result = await PostCategory.aggregate([
      { "$addFields": { "typeId": { "$toString": "$_id" } } }, {
        $lookup:
        {
          from: 'posts',
          localField: 'typeId',
          foreignField: 'typeId',
          as: 'locationCateasdas'
        }
      }, {
        $project: {
          name: 1, deletionFlag: 1,
          updatedAt: 1,
          typeLocation: 1, count: { $size: "$locationCateasdas" }
        }
      },{ $sort : { updatedAt : -1} }
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

const findByName = async name => {
  try {
    const result = await PostCategory.findOne({ name:name });
    return result;
  } catch (error) {
    throw error;
  }
};

const findById = async id => {
  try {
    const result = await PostCategory.findById(id);
    return result;
  } catch (error) {
    throw error;
  }
};

const updateNameById = async (id, field,name) => {
  try {
    let result = null;
    if (field === 'name'){
      const nameExisted = await findByName(name);
      if (nameExisted) TEM("Đã có loại bài viết này");
      result = await PostCategory.findByIdAndUpdate(id, { name : name }, {new: false});
    }
    else 
      result = await PostCategory.findByIdAndUpdate(id, { deletionFlag : name });
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteById = async id => {
  try {
    const result = await PostCategory.findByIdAndDelete({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  add,
  getAll,
  deleteById,
  findByName,
  findById,
  updateNameById
};
