import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol, MDBContainer, MDBBtn, MDBBtnGroup, MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';


function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(10);
  const [sortFilterValue, setSortFilterValue] = useState("");
  const [operation, setOperation] = useState("");

  const sortOptions = ["title", "platform", "score", "genre", "editors_choice"];

  useEffect(() => {
    loadGamesData(0, 10, 0);
  }, []);

  const loadGamesData = async (start, end, increase, optType = null, filterOrSortValue) => {
    switch (optType) {
      case "search":
        setOperation(optType);
        setSortValue("");
        return await axios
          .get(`http://localhost:5000/games?q=${value}&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.error(err));

      case "sort":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        return await axios
          .get(`http://localhost:5000/games?_sort=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.error(err));
      case "filter":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        return await axios
          .get(`http://localhost:5000/games?editors_choice=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.error(err));
      default:
        return await axios
          .get(`http://localhost:5000/games?_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.error(err));
    }
  };


  const handleReset = () => {
    setOperation("");
    setValue("");
    setSortFilterValue("");
    setSortValue("");
    loadGamesData(0, 10, 0);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    loadGamesData(0, 10, 0, "search")
    // return await axios
    //   .get(`http://localhost:5000/games?q=${value}`)
    //   .then((response) => {
    //     setData(response.data);
    //     setValue("");
    //   })
    //   .catch((err) => console.error(err));
  };

  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    loadGamesData(0, 10, 0, "sort", value)
    // return await axios
    //   .get(`http://localhost:5000/games?_sort=${value}&_order=asc`)
    //   .then((response) => {
    //     setData(response.data);
    //   })
    //   .catch((err) => console.error(err));
  };

  const handleFilter = async (value) => {
    loadGamesData(0, 10, 0, "filter", value)
    // return await axios
    //   .get(`http://localhost:5000/games?editors_choice=${value}`)
    //   .then((response) => {
    //     setData(response.data);
    //   })
    //   .catch((err) => console.error(err));
  };

  const renderPagination = () => {
    if (data.length < 10 && currentPage === 0) return null;
    if (currentPage === 0) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadGamesData(10, 20, 1, operation, sortFilterValue)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && data?.length === pageLimit) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadGamesData((currentPage - 1) * 10, currentPage * 10, -1, operation, sortFilterValue)}>Prev</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadGamesData((currentPage + 1) * 10, (currentPage + 2) * 10, 1, operation, sortFilterValue)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadGamesData((currentPage - 1) * 10, currentPage * 10, -1, operation, sortFilterValue)}>Prev</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  return (
    <MDBContainer>
      <h2 className='text-center' style={{marginTop:"20px",}}>Search Games</h2>
      <form style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "1000px",
        alignContent: "center",
      }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className='form-control'
          placeholder="Search Name ..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <MDBBtn type="submit" color="dark">
          Search
        </MDBBtn>
        <MDBBtn className="mx-2" color='info' onClick={() => handleReset()}>
          Reset
        </MDBBtn>


      </form>
      <div style={{ marginTop: "10px" }}>
        
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scople="col">No.</th>
                  <th scople="col">Name</th>
                  <th scople="col">Platform</th>
                  <th scople="col">Rating</th>
                  <th scople="col">Genre</th>
                  <th scople="col">Editor's Choice</th>
                </tr>
              </MDBTableHead>
              {data?.length === 0 ? (
                <MDBTableBody className="align-center mb-0">
                  <tr>
                    <td colSpan={20} className="text-center mb-0">No Data Found</td>
                  </tr>
                </MDBTableBody>
              ) : (
                Array.isArray(data) && data.map((item, index) => {
                  return (
                    <MDBTableBody key={index}>
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{item.title}</td>
                        <td>{item.platform}</td>
                        <td>{item.score}</td>
                        <td>{item.genre}</td>
                        <td>{item.editors_choice}</td>
                      </tr>
                    </MDBTableBody>)
                })
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <div
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "250px",
            alignContent: "center",
          }}>{renderPagination()}</div>
      </div>
      {data.length > 0 && (
        <MDBRow>
          <MDBCol size="8">
            <h5>Sort By:</h5>
            <select style={{ width: "50%", borderRadius: "2px", height: "35px" }}
              onChange={handleSort}
              value={sortValue}
            >
              <option>Select Value</option>
              {sortOptions.map((item, index) => (
                <option value={item} key={index}>{item}</option>
              ))}
            </select>
          </MDBCol>
          <MDBCol size="4" >
            <h5>Filter By Editor's Choice:</h5>
            <MDBBtnGroup>
              <MDBBtn color="success" onClick={() => handleFilter("Y")}>Yes</MDBBtn>
              <MDBBtn color="danger" style={{ marginLeft: "2px" }} onClick={() => handleFilter("N")}>No</MDBBtn>
            </MDBBtnGroup>
          </MDBCol>
        </MDBRow>
      )}


<br></br>
    </MDBContainer>
    
  );
}

export default App;
