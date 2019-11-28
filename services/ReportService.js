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
// const getTotalReports = async () => {
// 	try {
//     let res  = await Report.aggregate().group({_id: '$postId' , count: { $sum: 1 }})
//     return res;
// 	}
// 	catch (e) {
// 		return TE(res, 'Get report failed', 503);
// 	}
// };

module.exports = {
    addReport,
    updateReportStatus,
    getAllReports,
    getReportByPostId
}
