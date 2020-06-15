import axios from 'axios'

// 链整体情况
export const getUserList = params => {
  return axios({
    url: '/chainInfo',
    method: 'post',
    data: params ,
  })
}  