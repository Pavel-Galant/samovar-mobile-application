export default function () {
  return {
    isNotConnectedCount: 0,
    version: 0.13,
    triggers: [],
    triggerList: [
      {
        label: 'Tank temperature',
        value: 'TankTemp',
      },
      {
        label: 'Steam temperature',
        value: 'SteamTemp',
      },
      {
        label: 'Water temperature',
        value: 'WaterTemp',
      },
      {
        label: 'Pipe temperature',
        value: 'PipeTemp',
      },
      {
        label: 'ACP temperature',
        value: 'ACPTemp',
      },
      {
        label: 'Pressure',
        value: 'bme_pressure',
      }
    ]
  }
}
