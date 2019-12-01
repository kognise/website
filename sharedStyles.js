import css from 'styled-jsx/css'

export default css.global`
  @import url('https://fonts.googleapis.com/css?family=Overpass:400,700&display=swap');
  
  body {
    font-family: 'Overpass', sans-serif;
    line-height: 1.53;

    background: #ffffff;
    color: #000000;
    
    margin: 0;
    padding: 10px;
    box-sizing: border-box;
  }

  ::selection {
    background: #000000;
    color: #ffffff;
  }
`