const Locations = require('models/location')

exports.get = async (socket) => {
  console.log('locations')
  const r = await Locations.aggregate([
    { $addFields: { location_id: { $toString: '$_id' } } },
    {
      $lookup: {
        from: 'devices',
        localField: 'location_id',
        foreignField: 'parent_id',
        as: 'children'
      }
    },
    {
      $lookup: {
        from: 'devices',
        localField: 'ipaddress',
        foreignField: 'ipaddress',
        as: 'device'
      }
    },
    { $addFields: { device: { $arrayElemAt: ['$device', 0] } } }
  ]).sort({ index: 1 })
  socket.emit('rtLocations', r)
}