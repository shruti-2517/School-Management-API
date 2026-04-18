const { getPool } = require('../config/db');

// Haversine formula to calculate distance in km between two coordinates
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name.trim(), address.trim(), latitude, longitude]
    );

    res.status(201).json({
      status: 'success',
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude,
        longitude,
      },
    });
  } catch (err) {
    next(err);
  }
};

const listSchools = async (req, res, next) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    const pool = getPool();
    const [schools] = await pool.query('SELECT id, name, address, latitude, longitude FROM schools');

    if (schools.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No schools found',
        data: [],
      });
    }

    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance_km: parseFloat(
        haversineDistance(userLat, userLon, school.latitude, school.longitude).toFixed(4)
      ),
    }));

    schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    res.status(200).json({
      status: 'success',
      message: 'Schools fetched and sorted by proximity',
      data: schoolsWithDistance,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addSchool, listSchools };
