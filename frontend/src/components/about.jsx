import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import Copyright from './Copyright';

const About = () => {
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 2,
          my: 10,
          py: 10,
        }}
      >
        <div align="center">
          <a href="/">
            <img
              src="https://via.placeholder.com/80"
              alt="Logo"
              width="80"
              height="80"
            />
          </a>

          <h2 align="center">Lorem Ipsum</h2>

          <p align="center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            <br />
            <br />
            <Copyright />
            <br />
            <a href="#">Report Bug</a>
            &nbsp;&nbsp;&nbsp;
            <a href="#">Request Feature</a>
          </p>
        </div>
        <br />
        <center>
          <img
            src="https://via.placeholder.com/600x400"
            alt="placeholder"
            width={'80%'}
          />
        </center>
        <Typography variant="h5">Lorem Ipsum Dolor Sit Amet</Typography>
        <br />
        <ul style={{ marginLeft: '40px' }}>
          <li>
            <a href="#introduction">Introduction</a>
          </li>
          <li>
            <a href="#key-features">Key Features</a>
          </li>
          <li>
            <a href="#technologies-used">Technologies used</a>
            <ul style={{ marginLeft: '40px' }}>
              <li>
                <a href="#frontend">Frontend</a>
              </li>
              <li>
                <a href="#backend">Backend</a>
              </li>
              <li>
                <a href="#database">Database</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#configuration-and-setup">Configuration and Setup</a>
          </li>
          <li>
            <a href="#license">License</a>
          </li>
        </ul>
        <br />
        <h2 id="introduction">Introduction</h2>
        <br />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
          risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,
          ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula
          massa, varius a, semper congue, euismod non, mi.
        </p>
        <br />
        <center>
          <img
            src="https://via.placeholder.com/600x400"
            alt="Features"
            width={'80%'}
          />
        </center>
        <br />
        <h2 id="key-features">Key Features</h2>
        <br />
        <ul style={{ marginLeft: '40px' }}>
          <li>Lorem ipsum dolor sit amet.</li>
          <li>Consectetur adipiscing elit.</li>
          <li>Sed do eiusmod tempor incididunt.</li>
          <li>Ut labore et dolore magna aliqua.</li>
          <li>Ut enim ad minim veniam.</li>
        </ul>
        <br />
        <h2 id="technologies-used">Technologies used</h2>
        <br />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <br />
        <h4 id="frontend">Frontend</h4>
        <br />
        <ul style={{ marginLeft: '40px' }}>
          <li>Lorem Ipsum</li>
          <li>Dolor Sit Amet</li>
          <li>Consectetur Adipiscing</li>
          <li>Elit Sed</li>
          <li>Do Eiusmod</li>
          <li>Tempor Incididunt</li>
          <li>Ut Labore</li>
        </ul>
        <br />
        <h4 id="backend">Backend</h4>
        <br />
        <ul style={{ marginLeft: '40px' }}>
          <li>Lorem Ipsum</li>
          <li>Dolor Sit Amet</li>
          <li>Consectetur Adipiscing</li>
          <li>Elit Sed</li>
        </ul>
        <br />
        <h4 id="database">Database</h4>
        <br />
        <ul style={{ marginLeft: '40px' }}>
          <li>Lorem Ipsum</li>
        </ul>
        <br />
        <h2 id="configuration-and-setup">Configuration and Setup</h2>
        <br />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <br />
        <ul style={{ marginLeft: '40px' }}>
          <li>Lorem ipsum dolor sit amet.</li>
          <li>Consectetur adipiscing elit.</li>
          <li>Sed do eiusmod tempor incididunt.</li>
        </ul>
        <br />
        <p>In the first terminal</p>
        <pre>
          <Box sx={{ bgcolor: '#f0f0f0', p: 4, my: 4, overflowY: 'scroll' }}>
            <Typography sx={{ wordWrap: 'break-word' }}>
              <code>
                cd client <br />
                <br />
                //<span>to</span> <span>install</span> <span>client</span>-side
                dependencies <br />
                npm <span>install</span> <br />
                <br />
                //<span>to</span> <span>start</span> <span>client</span>
                <br />
                npm <span>start</span>
              </code>
            </Typography>
          </Box>
        </pre>

        <p>For setting up backend</p>
        <br />
        <ul style={{ marginLeft: '40px' }}>
          <li>Lorem ipsum dolor sit amet.</li>
          <li>Consectetur adipiscing elit.</li>
        </ul>
        <pre>
          <Box sx={{ bgcolor: '#f0f0f0', p: 4, my: 4, overflowY: 'scroll' }}>
            <span>PORT</span>=<span>3001</span>
            <br />
            <span>MONGODB_URI</span>=
            <br />
            <span>ACCESS_TOKEN_SECRET</span>=
          </Box>
        </pre>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <br />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <Box component="div" sx={{ bgcolor: '#f0f0f0', p: 4, my: 4 }}>
          <Typography sx={{ wordWrap: 'break-word' }}>
            node -e
            "console.log(require('crypto').randomBytes(256).toString('base64'));"
          </Typography>
        </Box>
        <p>
          In the second terminal (*in the project root directory (back-end))
        </p>
        <pre>
          <Box sx={{ bgcolor: '#f0f0f0', p: 4, my: 4, overflowY: 'scroll' }}>
            <Typography sx={{ wordWrap: 'break-word' }}>
              //to install server-side dependencies
            </Typography>
            npm <span>install</span> <br />
            <br />
            <Typography sx={{ wordWrap: 'break-word' }}>
              //<span>to</span> <span>start</span> <span>server</span>
            </Typography>
            <Typography sx={{ wordWrap: 'break-word' }}>
              npm <span>start</span>{' '}
            </Typography>
          </Box>
        </pre>
        <h2 id="comment">Comment</h2>
        <br />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <br />
        <h2 id="license">License</h2>
        <br />
        <p>This project is MIT licensed.</p>
        <br />
        <p>Copyright 2022 Lorem Ipsum</p>
        <br />
        <p>
          Permission is hereby granted, free of charge, to any person obtaining
          a copy of this software and associated documentation files (the
          "Software"), to deal in the Software without restriction, including
          without limitation the rights to use, copy, modify, merge, publish,
          distribute, sublicense, and/or sell copies of the Software, and to
          permit persons to whom the Software is furnished to do so, subject to
          the following conditions:
        </p>
        <br />
        <p>
          The above copyright notice and this permission notice shall be
          included in all copies or substantial portions of the Software.
        </p>
        <br />
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
          IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
          CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
          TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
          SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
        <br />
        <Copyright />
        <br />
      </Container>
    </>
  );
};

export default About;
