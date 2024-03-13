import React, { useState } from "react";
import { Box, makeStyles, Typography, Button } from "@material-ui/core";
import { Row } from "react-bootstrap";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import backendUrl from "../Product/axios";

// Components
import ProductCard from "../Product/ProductCard";

const Input = styled("input")({
  display: "none",
});

const useStyles = makeStyles({
  rec: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30px",
    padding: "0 40px",
  },
  inp: {
    display: "flex",
    flexDirection: "row",
  },
  recImage: {
    width: "350px",
    height: "350px",
    objectFit: "contain",
    marginTop: "40px",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "15px",
  },
  txt: {
    marginTop: "40px",
    fontSize: "30px",
    fontWeight: "bold",
  },
});

function Recommandation() {
  const classes = useStyles();

  const [img, setImg] = useState(null);
  const [prodData, setProdData] = useState([]);
  const [loading, setLoading] = useState(true);

  const givReco = async (e) => {
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/imageData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: img }),
      });

      if (response.ok) {
        const data = await response.json();
        setProdData(data);
      } else {
        console.error("Failed to get recommendations");
      }
    } catch (error) {
      console.error("Error while fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const imageHandler = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImg(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <p
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        Get Recommendation
      </p>
      <Box className={classes.rec}>
        <Box className={classes.inp}>
          <label htmlFor="contained-button-file">
            <Input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={imageHandler}
            />
            <Button variant="contained" component="span" color="primary">
              Upload
            </Button>
          </label>
          <label htmlFor="icon-button-file">
            <Input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={imageHandler}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        {img ? (
          <>
            <img src={img} alt="Picture" className={classes.recImage} />
            <Box className={classes.products}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={givReco}
                className={classes.btn}
              >
                Recommendation
              </Button>

              {loading ? (
                <></>
              ) : (
                <>
                  <Typography className={classes.txt}>
                    Products For You
                  </Typography>

                  <Box
                    className="container"
                    style={{ marginTop: "20px", marginBottom: "30px" }}
                  >
                    <Row xs={1} md={2} className="g-4">
                      {prodData.map((item) => {
                        return (
                          <ProductCard
                            id={item.product_id}
                            key={item.product_id}
                            url={item.img1}
                            title={item.title}
                            pTitle={item.title}
                            type={item.product_type}
                            price={item.variant_price}
                            aPrice={item.variant_compare_at_price}
                          />
                        );
                      })}
                    </Row>
                  </Box>
                </>
              )}
            </Box>
          </>
        ) : (
          <> </>
        )}
      </Box>
    </>
  );
}

export default Recommandation;
