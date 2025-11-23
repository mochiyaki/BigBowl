import Render from './render';

const Welcome = ({ArrowLoad,gate,nature}:any) => {

  const hash = "86515b94f468916a8534bad7c1861afc1cd5d3dc669b591a06ac47900a5080f5i2";
  // const hash = "86515b94f468916a8534bad7c1861afc1cd5d3dc669b591a06ac47900a5080f5i1";
  // const hash = "bafybeibba6rsulplzw2peejah5qf2db3sq33wa2qcw3od23bp46kaipdru";
  // const file = "0";

  return (
    <Render ArrowLoad={ArrowLoad} hash={hash} gate={gate} nature={nature}/>
    // <Render ArrowLoad={ArrowLoad} hash={hash} file={file} gate={gate}/>
  )
}

export default Welcome;