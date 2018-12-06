let currentPage = 1;
let showQty = 7;
let cakeList = () => {new CakeList(showQty * currentPage - showQty, showQty, currentPage)};
cakeList();