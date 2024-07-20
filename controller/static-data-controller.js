const { getStaticDataByKey } = require("../database/static-data-db.js");
const Responses = require("../common/responses.js");

const getStaticData = async (req, res) => {
  try {
    const parameterValue = req.params.parameter;
    const locale = req.query.locale;

    if (!parameterValue) {
      return res.status(400).json({ status: 400, message: "param required" });
    }

    const getStaticDataResult = await getStaticDataByKey(parameterValue);
    if (getStaticDataResult) {
      /// If locale exists get data by locale else get complete data
      if (locale) {
        const { value } = getStaticDataResult.message;
        const data = value[locale];
        if (data) {
          return functions.sendResponse(res, {
            statusCode: getStaticDataResult.statusCode,
            response: { data: data },
          });
        } else {
          return functions.sendResponse(res, {
            statusCode: 404,
            response: { message: `No data found for locale: ${locale}` },
          });
        }
      } else {
        const { value } = getStaticDataResult.message;
        if (value) {
          return functions.sendResponse(res, {
            statusCode: getStaticDataResult.statusCode,
            response: { data: value },
          });
        } else {
          return functions.sendResponse(res, {
            statusCode: getStaticDataResult.statusCode,
            response: {
              message: `No data found for param : ${parameterValue}`,
            },
          });
        }
      }
    } else {
      return functions.sendResponse(res, Responses.GET_STATIC_DATA_ERROR);
    }
  } catch (error) {
    return functions.sendResponse(res, Responses.GET_STATIC_DATA_ERROR);
  }
};

module.exports = {
  getStaticData,
};
