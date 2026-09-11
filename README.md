# Carl Joseph Aguas portfolio

Open `dist/index.html` to use the portfolio locally. It also works on a static website host. The optional Google Fonts stylesheet needs internet access; local fallback fonts are included.

## Replace your images and certificate placeholders

1. Create an `images` folder inside `dist` and put your project screenshots and certificate images there.
2. Open `dist/content.js` with a text editor.
3. For each project, replace `image: ''` with a path such as `image: 'images/hospital.png'`.
4. For each certificate, enter its real title, issuer and date, add its image path, and set `verified: true` only after supplying the actual details. Blank cards are explicitly labeled placeholders.
5. Save and refresh the page. A hosted copy needs to be republished for visitors to see changes. Clicking an added image opens the full image.

## Chatbot

The browser trains a small multinomial Naive Bayes intent classifier from labeled example questions in `dist/chatbot.js`. The classifier selects written factual answers; it is not a generative language model. Unknown words, uncertain classifications, and unsupported questions return an insufficient-data response. Statistical confidence is a routing score, not a guarantee that a question was understood. The conversation is not stored or transmitted. Reloading or resetting clears it.

Birthday, hobbies, career goal, development-role interest, and GitHub were supplied by Carl in the conversation. Availability and LinkedIn remain unspecified. Edit `personal` in `dist/content.js` to update them; edit the corresponding answer in `dist/chatbot.js` if changing the preferred-role description. Resume-sourced answers are in `dist/chatbot.js`.

All resume sections except the character reference are represented. The source resume is not served with the website because it contains that reference. The phone number is preserved exactly as written in the resume: 63+9452874381. Project screenshots and certificates have not been supplied.

The cursor word trail can be turned off below the hero and respects reduced-motion preferences. The layout adapts to mobile screens. Buttons, form fields, navigation and image dialogs support keyboard operation.
