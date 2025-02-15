/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dosis: "Dosis Regular",
        digiR: "Digi Reg",
        digiB: "Digi Bold",
        digiI: "Digi Italic",
        digiT: "Digi T",
      },
      colors: {
        offBlack: "#111313",
        offBlue: "#81A8F8",
        offWhite: "#F2F2F2",
        midGreen: "#09C261",
        lensLight: "#ABFE2C",
        midWhite: "#FAF4E8",
        mustard: "#FBEED1",
        midMus: "#FDF3D8",
        heat: "#FBDB86",
        deep: "#0091FF",
        libGray: "#DEDCE1",
        flight: "#F0E7E2",
        viol: "#9DA1F4",
        liBl: "#A3E3F4",
        liOr: "#F9C571",
        liVi: "#C1A8E8",
        offY: "#FEEA66",
        liDa: "#F27A24",
        grayBlue: "#C9D8E4",
        lime: "#77FFB8",
        baby: "#53B4FF",
        lily: "#F6DDC3",
        lili: "#B4FAB5",
        bluey: "#32C5FF",
        offYellow: "#F7F7F3",
        comp: "#B9B9B9",
        yell: "#FCDB8F",
        dcomp: "#606362",
        dullY: "#F9EBCC",
        bright: "#FA4040",
        dialY: "#FBDB84",
        dialG: "#A6DA70",
        lB: "#06A9CF",
        ocean: "#078FD6",
      },
      cursor: {
        focus: "url('/focus.png'), auto",
        erase:
          "url('https://thedial.infura-ipfs.io/ipfs/QmQzhmgH7ArRzi3xvEv7PH73vPBbo8vqm9EgNoLmvqwh3f'), auto",
      },
      backgroundImage: {
        spots:
          "url('https://thedial.infura-ipfs.io/ipfs/QmXcLBvsHDC8kNDe3WFQHzPpotVKG1AHsAHou1AbiYe6yp')",
        board:
          "linear-gradient(#131313 0.05em, transparent 0.05em),linear-gradient(90deg, #131313 0.05em, transparent 0.05em)",
      },
      backgroundSize: {
        boardSize: "2em 2em",
      },
      zIndex: {
        1: "1",
        2: "2",
        55: "55",
        60: "60",
        70: "70",
      },
      screens: {
        fo: "500px",
        galaxy: "300px",
        f1: "900px",
        f2: "360px",
        f3: "1275px",
        f4: "1475px",
        f5: "400px",
        f6: "1550px",
        f7: "600px"
      },
    },
  },
  plugins: [],
};
