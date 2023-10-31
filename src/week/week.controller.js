import path from 'path';
import { writeFile } from '../../utils/fileIO.js';
import { getWeekData, validateEndTime, validatePropertiesWeek, validateStartTime } from './week.service.js';
import { changeTime } from '../../utils/date.js';
import { getNextId } from '../../utils/utils.js';

const __dirname = path.resolve();
const fileWeekPath = path.join(__dirname, './data/week.json');
// Retrieve user on user
function getWeek(req, resp) {
  const weekData = getWeekData();
  if (!weekData) {
    return resp.status(500).json({ msg: 'Something went wrong' });
  }
  if (req.user.role === 'ADMIN') {
    return resp.status(200).json(weekData);
  } else {
    return resp.status(400).json({ msg: 'You don\'t have permission' });
  };
};

function getWeekByWeekNo(req, resp) {
  const weekData = getWeekData();
  if (!weekData) {
    return resp.status(500).json({ msg: 'Something went wrong' });
  }
  if (req.user.role === 'ADMIN') {
    const indexWeek = weekData.findIndex((week) => week.weekNo === Number(req.query.weekNo));
    const week = weekData[indexWeek];
    if (!week) {
      return resp.status(400).json({ msg: 'Can not found week by weekNo' });
    }
    return resp.status(200).json(week);
  } else {
    return resp.status(400).json({ msg: 'You don\'t have permission' });
  };
};
// Create week
function createWeek(req, resp) {
  const weekData = getWeekData();
  if (req.user.role === 'ADMIN') {
    if (!weekData && weekData instanceof Array === false) {
      return resp.status(500).json({ msg: 'Something went wrong' });
    }
    const newWeek = req.body;
    // Check each properties in Object have value yet
    try {
      validatePropertiesWeek(newWeek);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // Change Time StartTime
    try {
      changeTime(newWeek.startTime);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // validate StartTime
    try {
      validateStartTime(changeTime(newWeek.startTime));
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // Change Time endTime
    try {
      changeTime(newWeek.endTime);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // validate endTime
    try {
      validateEndTime(changeTime(newWeek.endTime));
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    if (changeTime(newWeek.startTime) > changeTime(newWeek.endTime)) {
      return resp.status(400).json({ msg: 'Wrong input time' });
    }
    // Get last group and increase group's id to 1
    const nextWeekNo = getNextId(weekData);
    newWeek.weekNo = nextWeekNo;
    // update data to file
    weekData.push(newWeek);
    writeFile(fileWeekPath, weekData);
    resp.status(200).json({ data: newWeek, msg: 'Create new week successful' });
  } else {
    return resp.status(400).json({ msg: 'You don\'t have permission' });
  };
};

// update week
function updateWeekByWeekNo(req, resp) {
  if (req.user.role === 'ADMIN') {
    const weekData = getWeekData();
    // Check data is available
    if (!weekData) {
      return resp.status(500).json({ msg: 'Something went wrong' });
    }
    const indexWeek = weekData.findIndex((week) => week.weekNo === Number(req.query.weekNo));
    let week = weekData[indexWeek];
    if (!week) {
      return resp.status(400).json({ msg: 'Can not found week by weekNo' });
    }
    // get data from the request body
    const weekUpdate = req.body;
    if (weekUpdate instanceof Object === true) {
      if (!weekUpdate) {
        return resp.status(400).json({ msg: 'Wrong input properties week' });
      }
      return resp.status(400).json({ msg: 'Wrong input week update' });
    }
    // Check each properties in Object have value yet
    try {
      validatePropertiesWeek(weekUpdate);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // Change Time StartTime
    try {
      changeTime(weekUpdate.startTime);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // validate StartTime
    try {
      validateStartTime(changeTime(weekUpdate.startTime));
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // Change Time endTime
    try {
      changeTime(weekUpdate.endTime);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // validate endTime
    try {
      validateEndTime(changeTime(weekUpdate.endTime));
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    if (changeTime(weekUpdate.startTime) > changeTime(weekUpdate.endTime)) {
      return resp.status(400).json({ msg: 'Wrong input time' });
    }
    // Get last group and increase group's id to 1
    const nextWeekNo = getNextId(weekData);
    weekUpdate.weekNo = nextWeekNo;
    // update data to file
    week = { ...week, ...weekUpdate };
    weekData[indexWeek] = week;
    writeFile(fileWeekPath, weekData);
    resp.status(200).json({ data: weekUpdate, msg: 'Update week successful' });
  } else {
    return resp.status(400).json({ msg: 'You don\'t have permission' });
  };
};

// Delete a week
function deleteWeekByWeekNo(req, resp) {
  if (req.user.role === 'ADMIN') {
    const weekData = getWeekData();
    // Check data is available
    if (!weekData) {
      return resp.status(500).json({ msg: 'Something went wrong' });
    }
    const indexWeek = weekData.findIndex((week) => week.weekNo === Number(req.query.weekNo));
    const week = weekData[indexWeek];
    if (!week) {
      return resp.status(400).json({ msg: 'Can not found week by weekNo' });
    }
    weekData.splice(indexWeek, 1);
    // update data to file
    writeFile(fileWeekPath, weekData);
    return resp.status(200).json({ msg: 'Week deleted successfully' });
  }
}

export default { getWeek, getWeekByWeekNo, createWeek, updateWeekByWeekNo, deleteWeekByWeekNo };
