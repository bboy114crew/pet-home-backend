const Report = require("../models/Report");
const Post = require("../models/Post");

const addReport = async data => {
    try {
        const report = new Report(data);
        const result = await report.save();
        return result;
    } catch (error) {
        throw error;
    }
};

const updateReportStatus = async (postId, status) => {
  try {
    let result = null;
    result = await Post.findByIdAndUpdate(postId, { deletionFlag : status });
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllReports = async () => {
	try {
    const result = await Report.aggregate([
      { $group : { _id:'$postId', totalReport: { $sum: 1 } }},
      { "$addFields": { "rpId": { "$toObjectId": "$_id" } }},
      { $lookup:
        {
          from: 'posts',
          localField: 'rpId',
          foreignField: '_id',
          as: 'postDetail'
        }
      },
        {
        $project: {
          totalReport:1,
          postId: 1,
          postDetail: 1
        }},
        { $sort : { totalReport : -1} }
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

const getReportByPostId = async (postId) => {
  try {
    let result = null;
    result = await Report.find({postId: postId}).populate('reporterId');
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
    addReport,
    updateReportStatus,
    getAllReports,
    getReportByPostId
}
