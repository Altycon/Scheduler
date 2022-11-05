
export const  Bevmo_Data = {
    id: 'bevmo',
    opened: ['08:00'],
    closed:['20:00','21:00','22:00'],
    hours: {
        management: ['45'],
        full_time: ['30','40'],
        part_time: ['5','32']
    },
    shifts: {
       full_time: {
        opening: ['08:00', '17:00'],
        day: ['11:00', '20:00'],
        evening: ['14:00', '22:00'],
        closing: ['12:00','21:00']
       },
       part_time: {
        opening: ['08:00', '13:00'],
        day: ['10:00', '15:00'],
        evening: ['02:00','19:00'],
        closing: ['16:00', '21:00']
       }
    }
}
export const  Gopuff_Data = {
    id: 'gopuff',
    opened: ['11:00'],
    closed:['00:00','15:00'],
    hours: {
        management: ['45'],
        full_time: ['30','40'],
        part_time: ['5','32']
    },
    shifts: {
        full_time: {
         opening: ['11:00', '20:00'],
         day: ['11:00', '19:00'],
         evening: ['15:00', '00:00'],
         closing: ['15:00', '00:00']
        },
        part_time: {
         opening: ['11:00', '16:00'],
         day: ['12:00', '17:00'],
         evening: ['16:00','21:00'],
         closing: ['19:00', '00:00']
        }
     }
}