const mutations = {
  addCart(state, info) {
    console.log(info);
  
    const oldInfo = state.cartList.find(item => item.iid === info.iid)

    
    if (oldInfo) {
      oldInfo.count += 1
    } else {
      info.count = 1
      info.checked = true
      state.cartList.push(info)
    }
  }
}

export default mutations

