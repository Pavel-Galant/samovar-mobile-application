import { tools } from 'boot/tools';
export const updateDeviceState = (state, data) => {
  // for test todo remove
  /*data.TankTemp = +(Math.random() * 100).toFixed(2);
  data.PipeTemp = +(Math.random() * 100).toFixed(2);
  data.SteamTemp = +(Math.random() * 100).toFixed(2);*/
  console.log(data);
  state.data = { ...state.data, ...data };

  state.temperatureHotOption.series[0].min = Math.floor(Math.min(data.TankTemp, data.PipeTemp, data.SteamTemp) - 5);
  state.temperatureHotOption.series[0].max = Math.round(Math.max(data.TankTemp, data.PipeTemp, data.SteamTemp) + 5);
  state.temperatureHotOption.series[0].data[0].value = tools.math.truncate2dec(Number(data.TankTemp));
  state.temperatureHotOption.series[0].data[1].value = tools.math.truncate2dec(Number(data.PipeTemp));
  state.temperatureHotOption.series[0].data[2].value = tools.math.truncate2dec(Number(data.SteamTemp));

  state.temperatureColdOption.series[0].min = Math.floor(Math.min(data.WaterTemp, data.ACPTemp) - 5);
  state.temperatureColdOption.series[0].max = Math.round(Math.max(data.WaterTemp, data.ACPTemp) + 5);
  state.temperatureColdOption.series[0].data[0].value = tools.math.truncate2dec(Number(data.WaterTemp));
  state.temperatureColdOption.series[0].data[1].value = tools.math.truncate2dec(Number(data.ACPTemp));
}
