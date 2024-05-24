import * as React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import StickyFooter from "../footer/StickyFooter";
import Link from "@mui/material/Link";

import { Twitter, Facebook, Instagram } from "@mui/icons-material";
export default function SignInSide() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container
        maxWidth="lg"
        component="main"
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={2} component="main">
          <Grid item xs={12} sm={8} md={6} component={Paper} square >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" gutterBottom>
                Thank You for Your Support!
              </Typography>
              <Typography variant="body1" paragraph>
                We are grateful for your generous donation. Your contribution
                helps us continue our mission and make a difference in the
                community.
              </Typography>
              <Typography variant="body1" paragraph>
                Hello World! I'm a computer student pouring my energy into this
                website projects. I know it's not a brand new idea and someone
                (probably) already did this, but I'm trying to make it look
                commercial and professional. Donations would be amazing! They'll
                help me upgrade the site, cover student expenses, and keep the
                momentum going. With your support, I can keep learning and
                crafting awesome stuff. Thanks a bunch for considering!
              </Typography>
              <Typography variant="caption">Follow our social media</Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Link href="#" color="inherit">
                  <Facebook sx={{ fontSize: 24, mr: 8 }} />{" "}
                  {/* Replace with actual Facebook icon */}
                </Link>
                <Link href="#" color="inherit">
                  <Twitter sx={{ fontSize: 24, mr: 8 }} />{" "}
                  {/* Replace with actual Twitter icon */}
                </Link>
                <Link href="#" color="inherit">
                  <Instagram sx={{ fontSize: 24 }} />{" "}
                  {/* Replace with actual Instagram icon */}
                </Link>
              </Box>
              <Box sx={{mt:2, display:"flex", flexDirection:"row"}}>
                <Link href="mailto:support@acme.com" color="inherit">
                contact us: support@acme.com
                </Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8} md={6} component={Paper} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Useful Links
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1">
                    <a href="#">Link 1</a>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <a href="#">Link 2</a>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <a href="#">Link 3</a>
                  </Typography>
                </li>
                {/* Add more placeholder links as needed */}
              </ul>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <StickyFooter />
    </Box>
  );
}
