export default function () {
  return {
    data: {
      ACPTemp: null,
      ActualVolumePerHour: null,
      BodyTemp_Pipe: null,
      BodyTemp_Steam: null,
      CurrrentSpeed: null,
      CurrrentStepps: null,
      PauseOn: null,
      PipeTemp: null,
      PowerOn: null,
      Status: null,
      SteamTemp: null,
      StepperStepMl: null,
      TankTemp: null,
      TargetStepps: null,
      VolumeAll: null,
      WFflowRate: null,
      WFtotalMl: null,
      WaterTemp: null,
      WthdrwlProgress: null,
      WthdrwlStatus: null,
      bme_pressure: null,
      bme_temp: null,
      crnt_tm: null,
      current_power_mode: null,
      current_power_p: null,
      current_power_volt: null,
      currentvolume: null,
      mixer: null,
      start_pressure: null,
      stm: null,
      target_power_volt: null,
      version: null,
    },
    temperatureHotOption: {
      series: [
        {
          type: 'gauge',
          min: 0,
          max: 0,
          anchor: {
            show: true,
            showAbove: true,
            size: 18,
            itemStyle: {
              color: '#FAC858'
            }
          },
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 8,
            length: '80%',
            offsetCenter: [0, '8%']
          },
          progress: {
            show: true,
            overlap: true,
            roundCap: true
          },
          axisLine: {
            roundCap: true
          },
          data: [
            {
              value: 0,
              name: 'Tank',
              title: {
                offsetCenter: ['-50%', '80%']
              },
              detail: {
                offsetCenter: ['-50%', '100%']
              }
            },
            {
              value: 0,
              name: 'Pipe',
              title: {
                offsetCenter: ['0%', '80%']
              },
              detail: {
                offsetCenter: ['0%', '100%']
              }
            },
            {
              value: 0,
              name: 'Steam',
              title: {
                offsetCenter: ['50%', '80%']
              },
              detail: {
                offsetCenter: ['50%', '100%']
              }
            }
          ],
          title: {
            fontSize: 14
          },
          detail: {
            width: 40,
            height: 14,
            fontSize: 14,
            color: '#fff',
            backgroundColor: 'inherit',
            borderRadius: 3,
            formatter: '{value}'
          }
        }
      ]
    },
    temperatureColdOption: {
      series: [
        {
          type: 'gauge',
          min: 0,
          max: 0,
          anchor: {
            show: true,
            showAbove: true,
            size: 18,
            itemStyle: {
              color: '#FAC858'
            }
          },
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 8,
            length: '80%',
            offsetCenter: [0, '8%']
          },
          progress: {
            show: true,
            overlap: true,
            roundCap: true
          },
          axisLine: {
            roundCap: true
          },
          data: [
            {
              value: 0,
              name: 'Water',
              title: {
                offsetCenter: ['-25%', '80%']
              },
              detail: {
                offsetCenter: ['-25%', '100%']
              }
            },
            {
              value: 0,
              name: 'ACP',
              title: {
                offsetCenter: ['25%', '80%']
              },
              detail: {
                offsetCenter: ['25%', '100%']
              }
            },
          ],
          title: {
            fontSize: 14
          },
          detail: {
            width: 40,
            height: 14,
            fontSize: 14,
            color: '#fff',
            backgroundColor: 'inherit',
            borderRadius: 3,
            formatter: '{value}'
          }
        }
      ]
    },
  }
}
