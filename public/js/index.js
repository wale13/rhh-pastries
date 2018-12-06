let currentPage = 1;
let showQty = 8;
let cakeList = () => {new CakeList(showQty * currentPage - showQty, showQty, currentPage)};
cakeList();