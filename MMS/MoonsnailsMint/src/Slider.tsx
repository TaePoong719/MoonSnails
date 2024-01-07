import React from 'react';
import {useState, useEffect, useRef} from 'react';
import styled from "styled-components";

const itemSize : number = 40;
type IntervalFunction = () => ( unknown | void )

const Image = styled.img`
  height: ${itemSize}px;
  width: ${itemSize}px;
`;

const SliderContainer = styled.div`
  position: relative;
  width: ${itemSize}vw;
  height: ${itemSize}vw;
  overflow: hidden; 
`;


const ImgBox =styled.div`
position: absolute; 
left: 0;
display: flex;
`;

const CSSBox= styled.div`
  width: ${itemSize}vw;
  height: ${itemSize}vw;
  box-shadow:5px 5px 40px 5px rgba(0,0,0,0.5);

`;
// 그림위아래에 ㄴ ㄱ 붙이는 css
// :before{
//   position:absolute;
//   color: rgb(170,170,170,0.5);
//   bottom:-55px;
//   left: 30px;
//   font-size:74px;
//   content:'ㄴ';
  
// }
// :after{
//   position:absolute;
//   color: rgb(170,170,170,0.5);
//   top:-55px;
//   right: 28px;
//   font-size:74px;
//   content: 'ㄱ';
// }



function Slider(){
    const [currentIndex,SetCurrentIndex] = useState(0);
    const imageSrc = ["snail1.png","snail2.png","snail3.png","snail4.png",'snail5.png','snail6.png']; //src는 다 다른걸로 해주세요
    const imageContainer = imageSrc.map((src) => (<Image style={{width:'40vw', height:'40vw'}} src={src} key={src} />));

    function useInterval( callback: IntervalFunction, delay: number | null ) {

      const savedCallback = useRef<IntervalFunction| null>( null )
      useEffect( () => {
        if (delay === null) return;
        savedCallback.current = callback
      } )
    
      useEffect( () => {
         if (delay === null) return;
        function tick() {
          if ( savedCallback.current !== null ) {
            savedCallback.current()
          }
        }
        const id = setInterval( tick, delay )
        return () => clearInterval( id )
    
      }, [ delay ] )
    }

    useInterval(() => {SlideSetIndex()},2000);

    function SlideSetIndex(){
        if (currentIndex > 4) {
          SetCurrentIndex(0)
        }
        else if (currentIndex < 0){
          SetCurrentIndex(4)
        }
        else{
            SetCurrentIndex(currentIndex => currentIndex + 1)
        }
    }

    return(
      <CSSBox>
        <SliderContainer>
          <div className="SlideBox" style={{transform:`translateX(${(-1)*(itemSize*currentIndex)}vw)`, transitionDuration:'0.2s'}}>
            <ImgBox>
              {imageContainer}
            </ImgBox>
          </div>
        </SliderContainer>
      </CSSBox>
    );

};

export default Slider