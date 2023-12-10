'use client';

import clsx from 'clsx';
import React from 'react';

const ASCII_INITIAL = [
  `cm/><acm/><acm/><acm/>sjsu*+.  <ac.  <ac,.  <a,.  <a,.  <a,.  <a+,.  <@sjsu*acm/>@<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>cm/>@s>@sjsujsu*+,*+,.  +,.  <,.  <a,.  <a,.  <a,.  
  cm/><acm/><acm/>@sjsu*.  <ac,.  <a,.  <a,.  <a,.  <a,.  <asu*+,.cm/>@s<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>cm/>@s>@sjsujsu*+,*+,.  +,. 
  cm/><acm/>/>@sjs,.  <a,.  <a,.  <a,.  <a,.  <a+,.  <@sjsu*<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>cm/>
  cm/>acm/>@+,.  <.  <ac,.  <a,.  <a,.  <a+,.  </>@sjs<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm
  cm/>jsu*+,.  <ac,.  <a,.  <a,.  <a*+,.  cm/>@s<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm
  />@s,.  <a,.  <a,.  <a,.  <au*+,. acm/>@<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm
  u*+,.  <ac,.  <a,.  <a*+,.  acm/>@<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm
  .  <.  <ac,.  <a+,.  <m/>@sj<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm
    <a,.  <a,.  <asjsu*+<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>cm/>@s/>@sjs>@sjsu@sjsu*@sjsu*>@sjsu/>@sjscm/>@s<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm
   <ac,.  <a+,.  <acm/>@<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>acm/>@@sjsu*u*+,. +,.  <,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a+,.  <*+,.  su*+,.@sjsu*m/>@sj<acm/><acm/><acm/><acm/><acm
   <ac.  <acjsu*+,<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>/>@sjs*+,.  ,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a*+,.  sjsu*+cm/>@s<acm/><acm
   <ac,.  <a/>@sjs<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>@sjsu*,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a.  <ac.  <ac.  <ac,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a+,.  <su*+,.m/>@
   <ac,.  <acm/>@s<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>>@sjsu,.  <a,.  <a,.  <a,.  <a,.  <a.  <ac.  <ac,.  <a+,.  <+,.  <,.  <a,.  <a.  <ac.  <ac,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  
   <ac+,.  <acm/>@<acm/><acm/><acm/><acm/><acm/><acm/><acm/>cm/>@s+,.  <,.  <a,.  <a,.  <a.  <ac.  <acu*+,. >@sjsucm/>@sacm/>@acm/>@acm/>@m/>@sj@sjsu*u*+,. ,.  <a.  <ac,.  <a,.  <a,.  <a,.  <a,.  <a,.  
   <ac*+,.  <acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>jsu*+,,.  <a,.  <a,.  <a.  <ac,.  <a>@sjsu<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>m/>@sjsu*+,..  <ac.  <ac,.  <a,.  <a,.  <a,.  
   <ac*+,.  <acm/><acm/><acm/><acm/><acm/><acm/><acm/>acm/>@*+,.  ,.  <a,.  <a,.  <a,.  <a/>@sjs<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>@sjsu*.  <ac,.  <a,.  <a,.  <a,.  
   <ac+,.  <acm/>@<acm/><acm/><acm/><acm/><acm/><acm/>m/>@sj,.  <a,.  <a,.  <a.  <acsjsu*+<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>sjsu*+.  <ac,.  <a,.  <a,.  
    <a,.  <acm/>@s<acm/><acm/><acm/><acm/><acm/><acm/>>@sjsu,.  <a,.  <a,.  <a,.  <acm/>@s<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>acm/>@+,.  <.  <ac,.  <a,.  
  .  <.  <ac/>@sjs<acm/><acm/><acm/><acm/><acm/><acm/>>@sjsu,.  <a,.  <a.  <ac*+,.  <acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>su*+,..  <ac,.  <a,.  
  u*+,.  <acsjsu*+<acm/><acm/><acm/><acm/><acm/><acm/>/>@sjs,.  <a,.  <a.  <ac*+,.  <acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>su*+,..  <ac,.  <a,.  
  @sjs.  <ac*+,.  <acm/><acm/><acm/><acm/><acm/><acm/>cm/>@s,.  <a,.  <a.  <ac*+,.  <acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>u*+,. .  <ac,.  <a,.  
  m/>@+,.  <,.  <am/>@sj<acm/><acm/><acm/><acm/><acm/><acm/>*+,.  .  <ac,.  <a,.  <acm/>@s<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>cm/>@s,.  <a,.  <a,.  <a,.  
  cm/>jsu*+,.  <acjsu*+,<acm/><acm/><acm/><acm/><acm/><acm/>sjsu*+.  <ac,.  <a.  <ac@sjsu*<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>sjsu*+.  <ac,.  <a,.  <a,.  
  cm/>cm/>@s,.  <a,.  <acm/>@s<acm/><acm/><acm/><acm/><acm/>cm/>@s+,.  <,.  <a.  <ac+,.  <acm/>@<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>cm/>@s,.  <a.  <ac,.  <a,.  <a,.  
  cm/><acm/>jsu*+,.  <acjsu*+,<acm/><acm/><acm/><acm/><acm/><acm/>sjsu*+.  <ac,.  <a.  <acjsu*+,<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>u*+,. .  <ac,.  <a,.  <a,.  <a,.  
  />@s<acm/>cm/>@s,.  <a,.  <am/>@sj<acm/><acm/><acm/><acm/><acm/>acm/>@*+,.  .  <ac,.  <a.  <acsjsu*+<acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/><acm/>su*+,..  <ac,.  <a,.  <a,.  <a,.  <a,.  
  *+,.<acm/><acm/>@sjsu*.  <ac*+,.  <acm/><acm/><acm/><acm/><acm/><acm/>/>@sjs,.  <a,.  <a,.  <a.  <acjsu*+,acm/>@<acm/><acm/><acm/><acm/><acm/><acm/>acm/>@su*+,..  <ac,.  <a,.  <a,.  <a,.  <a,.  <a,.  
   <ac/>@sjs<acm/><acm/>u*+,. .  <acjsu*+,<acm/><acm/><acm/><acm/><acm/><acm/>@sjsu*,.  <a,.  <a,.  <a.  <ac+,.  <@sjsu*cm/>@sacm/>@acm/>@cm/>@s@sjsu*+,.  <.  <ac,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a+,. 
  <acm*+,.  <acm/><acm/>cm/>@s,.  <a.  <ac>@sjsu<acm/><acm/><acm/><acm/><acm/><acm/>sjsu*+,.  <a,.  <a,.  <a.  <ac.  <ac,.  <a+,.  <+,.  <,.  <a.  <ac.  <ac,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a>@sj
  .  <  <acmsjsu*+<acm/><acm/>>@sjsu.  <ac,.  <am/>@sj<acm/><acm/><acm/><acm/><acm/><acm/>sjsu*+,.  <a,.  <a,.  <a,.  <a,.  <a.  <ac.  <ac,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <asu*+,.<acm
  sjsu.  <ac.  <acm/>@sj<acm/><acm/>sjsu*+.  <ac+,.  <cm/>@s<acm/><acm/><acm/><acm/><acm/><acm/>>@sjsu+,.  <.  <ac,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a*+,.  acm/>@<acm
  cm/>u*+,.   <acm+,.  <acm/>@<acm/><acm/>su*+,..  <acu*+,. acm/>@<acm/><acm/><acm/><acm/><acm/><acm/>m/>@sju*+,. ,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a,.  <a+,.  <+,.  <m/>@sj<acm/><acm`,
];

const ASCII_LOGO = [
  `                                                       _           
                                           ____       (_)          
     __ _  ___ _ __ ___ ______ ___ ___    / __ \\   ___ _ ___ _   _ 
    / _\` |/ __| '_ \` _ \\______/ __/ __|  / / _\` | / __| / __| | | |
   | (_| | (__| | | | | |    | (__\\__ \\ | | (_| | \\__ \\ \\__ \\ |_| |
    \\__,_|\\___|_| |_| |_|     \\___|___/  \\ \\__,_| |___/ |___/\\__,_|
                                          \\____/     _/ |          
                                                    |__/           `,
];

export default function Hero({ ascii }: { ascii?: string[] }) {
  const [isShownLogo, setIsShownLogo] = React.useState(false);

  React.useEffect(() => {
    let imageNum = 0;
    const asciiImage = document.querySelector('pre#ascii');
    let interval = setInterval(() => {
      asciiImage && ascii && (asciiImage.textContent = ascii[imageNum]);
      imageNum === 75 && !isShownLogo && setIsShownLogo(true);
      imageNum = imageNum > 936 ? 75 : imageNum + 1;
    }, 100);
    return () => clearInterval(interval);
  }, [ascii, isShownLogo]);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <pre
        className={clsx(
          'absolute left-[49.25%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-extrabold text-[#FFDF93] transition-all duration-500 ease-in-out',
          {
            'opacity-0': !isShownLogo,
            'opacity-100': isShownLogo,
          },
        )}
      >
        {ASCII_LOGO}
      </pre>
      <pre className="text-[10px] text-[#599FD6]" id="ascii">
        {ASCII_INITIAL}
      </pre>
    </div>
  );
}
