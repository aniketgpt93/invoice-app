export const debounce =(func, delay)=> {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export const generateRandomNumber=()=> {
  return Math.floor(Math.random() * 1000); // 0 to 999
}

console.log(generateRandomNumber());

export const getFromDate= (range)=> {
    const today = new Date();
    switch (range) {
      case "Today":
        return { from: today.toISOString().split("T")[0], to: today.toISOString().split("T")[0] };
      case "Week": {
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
        return { from: firstDay.toISOString().split("T")[0], to: new Date().toISOString().split("T")[0] };
      }
      case "Month": {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: firstDay.toISOString().split("T")[0], to: new Date().toISOString().split("T")[0] };
      }
      case "Year": {
        const firstDay = new Date(today.getFullYear(), 0, 1);
        return { from: firstDay.toISOString().split("T")[0], to: new Date().toISOString().split("T")[0] };
      }
      default:
        return { from: today.toISOString().split("T")[0], to: today.toISOString().split("T")[0] };
    }
  }
