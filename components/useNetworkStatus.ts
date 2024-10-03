// import NetInfo from "@react-native-community/netinfo";

// function checkInternetConnectivity(callback: any) {
  
//   // Fetch the current network state
//   NetInfo.fetch().then((state) => {
//     console.log("Initial connection type:", state.type);
//     console.log("Initial is connected:", state.isConnected);
//     callback(state.isConnected);
//   });

//   // Subscribe to network state changes
//   const unsubscribe = NetInfo.addEventListener((state) => {
//   console.log("Connection type changed:", state.type);
//     console.log("Is connected changed:", state.isConnected);
//     callback(state.isConnected);
//   });

//   // Return the unsubscribe function for cleanup
//   return unsubscribe;
// }

// export default checkInternetConnectivity;
