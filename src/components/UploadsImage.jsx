import React from "react";
import ReactDOM from "react-dom";
import ImageUploader from 'react-images-upload';



export default class UploadsImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pictures: [] };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(picture) {

    const reader = new FileReader();
    reader.onload = () =>
    {
      if (reader.readyState == 2)
      {
          this.props.setScoreBackImage(reader.result)
      }
    }
    if (picture[0])
      reader.readAsDataURL(picture[0])
    else
      this.props.setScoreBackImage("")
    this.setState({
      pictures: this.state.pictures.concat(picture),
      
    },()=>{
      console.log(this.state.pictures[0].run)

    });
  }

  render() {
    const fileContainerStyle = 
    {
      boxShadow: 'none',
      margin:'26px 50px 0px 50px',
      textAlign: 'right',
      lineHeight: '56px',
      fontSize: '24px',
      padding: '0px 0px',
    }
    const buttonStyle =
    {
      outlineOffset: '0px',
      background: '#640000',
      color: 'white',
      outline: 'none',
      border: 'none',
      height:'56px',
      width:'100%',
      display:'block',
      fontSize:'24px',
      borderRadius:0,
      fontFamily: 'mikhmoret-regular'
    }
    return (
      <ImageUploader
        withIcon={false}
        label=""
        withPreview={true}
        buttonText=' בחר תמונה'
        maxFileSize={456784378452}
        onChange={this.onDrop}
        imgExtension={['.jpg', '.gif', '.png', '.gif' ,'jpeg']}
        buttonClassName="UploadsImage"
        buttonStyles={buttonStyle}
        fileContainerStyle={fileContainerStyle}
      />
    );
  }
}