"use client";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BREAKPOINTS } from "../lib/consts";
import Script from "next/script";

declare global {
  interface Window {
    TweenMax: any;
    TimelineMax: any;
    Sine: any;
    Linear: any;
    Power3: any;
    Power2: any;
    Power1: any;
  }
}

const AnimatedWine = () => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 100 400 400"
      className="sm:backdrop-blur-sm"
    >
      <defs>
        <linearGradient
          id="frontGrad"
          x1="300"
          x2="300"
          y1="100"
          y2="600"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.2" stopColor="#005DE9"></stop>
          <stop offset="0.7" stopColor="#ED1E79"></stop>
        </linearGradient>
        <mask>
          <path
            fill="#FFF"
            d="M337 273.9V129h-74v144.8c-37 14.7-63.1 50.8-63.1 93 0 55.2 44.8 100 100 100s100-44.8 100-100c.1-42.1-26-78.2-62.9-92.9z"
            className="liquidMask"
          ></path>
        </mask>
        <clipPath id="sphereMask">
          <circle
            cx="300"
            cy="367"
            r="100"
            fill="red"
            strokeMiterlimit="10"
            strokeWidth="0.496"
          ></circle>
        </clipPath>
        <filter id="goo" colorInterpolationFilters="sRGB">
          <feGaussianBlur
            in="SourceGraphic"
            result="blur"
            stdDeviation="7 7"
          ></feGaussianBlur>
          <feColorMatrix
            in="blur"
            result="cm"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -7"
          ></feColorMatrix>
          <feComposite in="SourceGraphic" in2="cm"></feComposite>
        </filter>
      </defs>
      <g className="liquidMaskGroup" clipPath="url(#sphereMask)">
        <path
          fill="none"
          d="M1199.9 365.1c-41.8 0-79.4 9.8-107.4 8.1-38.9-2.3-54.5-16.4-83.6-19.9-29.1-3.5-71.5 3.4-110.4 1-28-1.7-56.4-13.7-98.2-13.7-41.8 0-70.2 12-98.2 13.7-38.9 2.3-81.4-4.6-110.4-1-29.1 3.5-44.7 17.5-83.6 19.9-28 1.7-65.7-8.2-107.5-8.2s-79.5 9.9-107.5 8.2c-38.9-2.3-54.5-16.3-83.6-19.9-29.1-3.5-72 3.4-110.9 1-28-1.7-56.7-13.7-98.7-13.7V438h1200v-72.9z"
          className="liquidBack"
        ></path>
        <g
          fill="url(#frontGrad)"
          className="liquidBubblesGroup"
          clipPath="url(#sphereMask)"
        >
          <image
            className="stagger"
            href="/stagger.png"
            height="120"
            width="120"
            x="250"
            y="290"
          />
          <path
            d="M1199.9 329.6c-44 0-70.6 29.4-96.4 33-36.1 5.1-70.7-14.5-106.8-9.4-25.8 3.7-52.4 33.3-96.4 33.3-44 0-70.7-29.7-96.4-33.4-36.1-5.1-70.7 14.4-106.8 9.2-25.8-3.7-52.4-33.3-96.5-33.3-44 0-70.7 29.7-96.5 33.3-36.1 5.1-70.7-14.4-106.8-9.3-25.8 3.7-52.4 33.3-96.5 33.3-44 0-70.7-29.7-96.5-33.3-36.1-5.1-71.2 14.4-107.3 9.3C71.2 358.6 45 329 0 329v204h1200l-.1-203.4z"
            className="liquidFront"
          ></path>
          <circle cx="350" cy="400" r="8" className="bubble0"></circle>
          <circle cx="320" cy="400" r="6" className="bubble1"></circle>
          <circle cx="300" cy="400" r="12" className="bubble2"></circle>
          <circle cx="276" cy="400" r="3" className="bubble3"></circle>
          <circle cx="244" cy="400" r="4" className="bubble4"></circle>
          <circle cx="280" cy="400" r="5" className="bubblePop0"></circle>
          <circle cx="310" cy="390" r="5" className="bubblePop1"></circle>
          <circle cx="350" cy="410" r="5" className="bubblePop2"></circle>
        </g>
        <g fill="none" className="darkBubbleGroup">
          <circle cx="310" cy="480" r="7" className="darkBubble"></circle>
          <circle cx="360" cy="480" r="5" className="darkBubble"></circle>
          <circle cx="230" cy="480" r="6" className="darkBubble"></circle>
          <circle cx="345" cy="480" r="3" className="darkBubble"></circle>
          <circle cx="290" cy="480" r="8" className="darkBubble"></circle>
          <circle cx="320" cy="480" r="2" className="darkBubble"></circle>
          <circle cx="260" cy="480" r="9" className="darkBubble"></circle>
        </g>
        <path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="4"
          d="M37.4 9l6.3-6.3M2 44.4l6.7-6.7m28.7-.3l6.3 6.3M2 2l6.7 6.7"
          className="pop"
        ></path>
      </g>
      <radialGradient
        id="shine"
        cx="280"
        cy="337"
        r="100"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.02" stopColor="#fff" stopOpacity="0.2"></stop>
        <stop offset="1" stopColor="#1B52D4" stopOpacity="0.1"></stop>
      </radialGradient>

      <g fill="url(#shine)" transform="matrix(10 0 0 10 60 160)">
        <path d="M16.68 28c9.7-4.51 13.92-14 15.72-20.59a13.9 13.9 0 00-1.56-4.47C30.12 1.86 27.77 1.5 24 1.5s-6.12.36-6.84 1.44c-1.59 1.83-3.59 15-3.59 17.6A10.39 10.39 0 0016.68 28z"></path>
        <path
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth=".7"
          d="M17.16 2.94C17.88 1.86 20.22 1.5 24 1.5s6.12.36 6.84 1.44c1.59 1.83 3.59 15 3.59 17.6a10.43 10.43 0 01-20.86 0c0-2.62 2-15.77 3.59-17.6z"
        ></path>
        <path
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth=".65"
          d="M30.84 2.94c0 .79-3.06 1.44-6.84 1.44s-6.84-.65-6.84-1.44"
        ></path>
      </g>
    </svg>
    <Script
      id="tweenmax-js"
      src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.17.0/TweenMax.min.js"
      onLoad={() => {
        /* Based on Chris Ganon pen https://codepen.io/chrisgannon/pen/MwMpBQ*/
        const select = function (s: string) {
            return document.querySelector(s);
          },
          liquidFront = select(".liquidFront") as Element,
          liquidMaskGroup = select(".liquidMaskGroup") as Element,
          liquidBack = select(".liquidBack") as Element,
          bubble0 = select(".bubble0") as Element,
          bubble1 = select(".bubble1") as Element,
          bubble2 = select(".bubble2") as Element,
          bubble3 = select(".bubble3") as Element,
          bubble4 = select(".bubble4") as Element,
          pop = select(".pop") as Element,
          bubblePop0 = select(".bubblePop0") as Element,
          bubblePop1 = select(".bubblePop1") as Element,
          bubblePop2 = select(".bubblePop2") as Element,
          stagger = select(".stagger") as Element,
          liquidBubblesGroup = select(".liquidBubblesGroup") as Element,
          darkBubble = document.getElementsByClassName("darkBubble");
        const pop1 = pop.cloneNode(true);
        const pop2 = pop.cloneNode(true);
        liquidMaskGroup.appendChild(pop1);
        liquidMaskGroup.appendChild(pop2);

        if (screen.width >= BREAKPOINTS.mobile) {
          window.TweenMax.set(liquidBubblesGroup, {
            filter: "url(#goo)",
            "-webkit-filter": "url(#goo)",
          });
        }

        const mainTimeline = new window.TimelineMax();
        const staggerTimeline = new window.TimelineMax({ repeat: -1 });
        const staggerRotateTimeline = new window.TimelineMax({ repeat: -1 });
        staggerRotateTimeline
          .set(stagger, {
            transformOrigin: "bottom center",
          })
          .to(stagger, 4, {
            rotation: 20,
            ease: window.Sine.easeOut,
          })
          .to(stagger, 4, {
            rotation: -20,
            ease: window.Sine.easeOut,
          })
          .to(stagger, 4, {
            rotation: 0,
            ease: window.Sine.easeOut,
          });
        staggerTimeline
          .set(stagger, {
            x: -15,
          })
          .to(stagger, 3, {
            x: -75,
            ease: window.Linear.easeNone,
          })
          .to(stagger, 6, {
            x: 45,
            ease: window.Linear.easeNone,
          })
          .to(stagger, 3, {
            x: -15,
            ease: window.Linear.easeNone,
          });

        const frontLiquidTimeline = new window.TimelineMax({ repeat: -1 });
        frontLiquidTimeline.to(liquidFront, 3, {
          x: -600,
          ease: window.Linear.easeNone,
        });

        const backLiquidTimeline = new window.TimelineMax({ repeat: -1 });
        backLiquidTimeline.from(liquidBack, 3, {
          x: -800,
          ease: window.Linear.easeNone,
        });

        const b0 = new window.TimelineMax({
          repeat: -1,
          delay: 0,
          repeatDelay: 2,
          onRepeat: doRepeat,
          onRepeatParams: [bubble0],
        });
        b0.timeScale(1);
        b0.to(bubble0, 0.8, {
          attr: {
            cy: "-=80",
          },
          ease: window.Sine.easeOut,
        }).to(bubble0, 0.8, {
          attr: {
            cy: "+=80",
          },
          ease: window.Sine.easeIn,
        });

        const b1 = new window.TimelineMax({
          repeat: -1,
          delay: 3,
          repeatDelay: 5,
          onRepeat: doRepeat,
          onRepeatParams: [bubble1],
        });
        b1.timeScale(1);
        b1.to(bubble1, 0.7, {
          attr: {
            cy: "-=120",
          },
          ease: window.Sine.easeOut,
        }).to(bubble1, 0.7, {
          attr: {
            cy: "+=120",
          },
          ease: window.Sine.easeIn,
        });

        const b2 = new window.TimelineMax({
          repeat: -1,
          delay: 1,
          repeatDelay: 6,
          onRepeat: doRepeat,
          onRepeatParams: [bubble2],
        });
        b2.timeScale(1);
        b2.to(bubble2, 1, {
          attr: {
            cy: "-=70",
          },
          ease: window.Sine.easeOut,
        }).to(bubble2, 1, {
          attr: {
            cy: "+=70",
          },
          ease: window.Sine.easeIn,
        });

        const b3 = new window.TimelineMax({
          repeat: -1,
          delay: 1,
          repeatDelay: 4,
          onRepeat: doRepeat,
          onRepeatParams: [bubble3],
        });
        b3.timeScale(1);
        b3.to(bubble3, 0.72, {
          attr: {
            cy: "-=140",
          },
          ease: window.Sine.easeOut,
        })

          .to(bubble3, 0.72, {
            attr: {
              cy: "+=140",
            },
            ease: window.Sine.easeIn,
          })
          .to(bubble3, 0.88, {
            attr: {
              cy: "-=110",
            },
            ease: window.Sine.easeOut,
          })

          .to(bubble3, 0.88, {
            attr: {
              cy: "+=110",
            },
            ease: window.Sine.easeIn,
          });

        const b4 = new window.TimelineMax({
          repeat: -1,
          delay: 2,
          repeatDelay: 2,
          onRepeat: doRepeat,
          onRepeatParams: [bubble4],
        });
        b4.timeScale(1);
        b4.to(bubble4, 0.7, {
          attr: {
            cy: "-=99",
          },
          ease: window.Sine.easeOut,
        }).to(bubble4, 0.7, {
          attr: {
            cy: "+=99",
          },
          ease: window.Sine.easeIn,
        });

        //with pops

        const bPop0 = new window.TimelineMax({
          repeat: -1,
          delay: 2,
          repeatDelay: 5,
        });
        bPop0.timeScale(1);
        bPop0
          .to(bubblePop0, 0.82, {
            attr: {
              cy: "-=110",
            },
            ease: window.Sine.easeOut,
          })
          .set(bubblePop0, {
            alpha: 0,
          })
          .set(pop, {
            x: 256,
            y: 269,
            transformOrigin: "50% 50%",
          })

          .from(pop, 0.2, {
            scale: 0,
            transformOrigin: "50% 50%",
          })
          .to(
            pop,
            0.1,
            {
              alpha: 0,
            },
            "-=0.1"
          );

        const bPop1 = new window.TimelineMax({
          repeat: -1,
          delay: 1,
          repeatDelay: 7,
        });
        bPop1.timeScale(1);
        bPop1
          .to(bubblePop1, 0.92, {
            attr: {
              cy: "-=130",
            },
            ease: window.Sine.easeOut,
          })
          .set(bubblePop1, {
            alpha: 0,
          })
          .set(pop1, {
            x: 306,
            y: 262,
            transformOrigin: "50% 50%",
          })

          .fromTo(
            pop1,
            0.2,
            {
              scale: 0,
            },
            {
              scale: 0.8,
              transformOrigin: "50% 50%",
            }
          )
          .to(
            pop1,
            0.1,
            {
              alpha: 0,
            },
            "-=0.1"
          );

        const bPop2 = new window.TimelineMax({
          repeat: -1,
          delay: 5,
          repeatDelay: 9,
        });
        bPop2.timeScale(1);
        bPop2
          .to(bubblePop2, 0.92, {
            attr: {
              cy: "-=90",
            },
            ease: window.Sine.easeOut,
          })
          .set(bubblePop2, {
            alpha: 0,
          })
          .set(pop2, {
            x: 346,
            y: 322,
            transformOrigin: "50% 50%",
          })

          .fromTo(
            pop2,
            0.2,
            {
              scale: 0,
            },
            {
              scale: 0.8,
              transformOrigin: "50% 50%",
            }
          )
          .to(
            pop2,
            0.1,
            {
              alpha: 0,
            },
            "-=0.1"
          );

        const darkBubble0 = new window.TimelineMax({ repeat: -1 });
        darkBubble0.staggerTo(
          darkBubble,
          2,
          {
            attr: {
              cy: 370,
              r: 0,
            },
            fill: "#2E69E2",
            ease: window.Power3.easeIn,
          },
          0.9
        );

        mainTimeline
          .add(staggerRotateTimeline, 0)
          .add(staggerTimeline, 0)
          .add(frontLiquidTimeline, 0)
          .add(backLiquidTimeline, 0)
          .add(b0, 0)
          .add(b1, 0)
          .add(b2, 0)
          .add(b3, 0)
          .add(b4, 0)
          .add(bPop0, 0)
          .add(bPop1, 0)
          .add(bPop2, 0)
          .add(darkBubble0, 0);

        mainTimeline.timeScale(1);

        function doRepeat(bubble: any) {
          window.TweenMax.set(bubble, {
            attr: {
              cx: getBetweenVal(240, 360),
            },
          });
        }

        function getBetweenVal(min: number, max: number) {
          return Math.floor(Math.random() * (max - min + 1) + min);
        }
      }}
    />
  </>
);

export default AnimatedWine;
