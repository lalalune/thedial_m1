import { FunctionComponent } from "react";
import MarqueeText from "react-fast-marquee";

const Marquee: FunctionComponent = (): JSX.Element => {
  return (
    <div className="absolute w-full h-fit grid grid-flow-col auto-cols-auto row-start-2 self-end pb-20 fo:pb-14">
      <MarqueeText gradient={false} speed={30} direction={"right"}>
        <div className="relative w-full h-fit text-white font-digiB uppercase leading-30 text-9xl lg:text-[10rem] px-2 pb-6">
          WE’RE SO HAPPY YOU DISCOVERED THE NEW SOCIAL WEB.{" "}
        </div>
      </MarqueeText>
    </div>
  );
};

export default Marquee;
