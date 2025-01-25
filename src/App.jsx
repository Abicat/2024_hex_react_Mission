import { useState } from "react";
import axios from "axios";
import "./assets/scss/all.scss";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState({});
  const [mainImage, setMainImage] = useState(null);

  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example",
  });

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const login = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        axios.defaults.headers.common["Authorization"] = token;
        setIsAuth(true);
        fetchProducts();
      } catch (error) {
        alert("登入失敗");
        console.log("登入失敗：", error);
      }
    };
    login();
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products/all`
      );
      const productsArray = Object.values(res.data.products);
      setProducts(productsArray);
    } catch (error) {
      alert("無法獲取產品列表，請稍後再試");
      console.error("獲取產品列表錯誤：", error);
    }
  };

  const changeDetail = (product) => {
    setTempProduct(product);
    setMainImage(product.imageUrl);
  };

  const changeMainImage = (image) => {
    setMainImage(image);
  };

  const checkUserLogin = () => {
    axios
      .post(`${BASE_URL}/v2/api/user/check`)
      .then((res) => alert("使用者已登入"))
      .catch((error) => console.log(error));
  };

  return (
    <>
      {isAuth ? (
        <div className="container py-5">
          <div className="row">
            <div className="col-6">
              <button
                onClick={checkUserLogin}
                className="btn btn-success mb-5"
                type="button"
              >
                檢查使用者是否登入
              </button>
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled}</td>
                      <td>
                        <button
                          onClick={() => changeDetail(product)}
                          className="btn btn-primary"
                          type="button"
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <h2>單一產品細節</h2>
              {tempProduct.title ? (
                <div className="card">
                  <img
                    src={mainImage || tempProduct.imageUrl}
                    className="card-img-top img-fluid"
                    alt={tempProduct.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge rounded-pill text-bg-primary">
                      &nbsp; #{tempProduct.category} &nbsp;
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <p className="card-text text-secondary">
                      <del>{tempProduct.origin_price} 元</del> /{" "}
                      {tempProduct.price} 元
                    </p>
                    <h5 className="card-title">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      <div className="thumbnail-container">
                        <img
                          src={tempProduct.imageUrl}
                          alt={tempProduct.title}
                          className={`thumbnail-image ${
                            mainImage === tempProduct.imageUrl ? "active" : ""
                          }`}
                          onClick={() => changeMainImage(tempProduct.imageUrl)}
                        />
                        <div className="thumbnail-cover">查看圖片</div>
                      </div>
                      {tempProduct.imagesUrl?.map((image, index) => (
                        <div key={index} className="thumbnail-container">
                          <img
                            src={image}
                            alt={`圖片 ${index + 1}`}
                            className={`thumbnail-image ${
                              mainImage === image ? "active" : ""
                            }`}
                            onClick={() => changeMainImage(image)}
                          />
                          <div className="thumbnail-cover">查看圖片</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-secondary mt-2">請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <div style={{ width: "100%", maxWidth: "300px" }}>
           <h1 className="mb-5 text-center">請先登入</h1>
            <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
              <div className="form-floating mb-3">
                <input
                  name="username"
                  value={account.username}
                  onChange={handleInputChange}
                  type="email"
                  className="form-control"
                  id="username"
                  placeholder="name@example.com"
                />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  name="password"
                  value={account.password}
                  onChange={handleInputChange}
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                />
                <label htmlFor="password">Password</label>
              </div>
              <button className="btn btn-primary w-100">登入</button>
            </form>
            <p className="mt-3 text-center">
              尚未註冊? &nbsp;
              <a href="https://ec-course-api.hexschool.io/" target="_blank">
                點此註冊會員
              </a>
            </p>
            <p className="mt-3 mb-3 text-muted text-center">&copy; 2024~∞ - 六角學院</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
