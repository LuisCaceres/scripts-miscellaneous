// {
//     const rowNumber = -1;
//     let numberOfNewRows = 70;

//     const table = $0 as HTMLTableElement;

//     if (table.nodeName.toUpperCase() !== 'TABLE') {
//         alert('Please select a `table` element before proceeding.');
//         throw Error(`Elemented selected isn't a \`table\` element.`);
//     }

//     const row = [...table.rows].at(rowNumber) as HTMLTableRowElement;
//     const clones: HTMLTableRowElement[] = [];

//     while (numberOfNewRows--) {
//         const clone = row?.cloneNode(true) as HTMLTableRowElement;
//         clones.push(clone);
//     }

//     table.append(...clones);
// }

const steps = [

  `Wait until the web page "Donate | Vision Australia's Carols by Candlelight" loads.`,
  `Read the heading with text "Help children like Eddy who are blind or have low vision to thrive!".`,
  `Read the heading with text "Give now to help share the magic with kidslike Eddy this Christmas.".`,
  `Read the text that starts with "Your personal information will be collected and used in accordance with our Dono".`,
  `Read the heading with text "Help share the magic".`,
  `Read the heading with text "Let's reach $1 million to help children thrive!".`,
  `Read the heading with text "Our matching donors".`,
  `Read the heading with text "*Matched giving disclosure statement".`,
  `Read the heading with text "Recent Donors".`,
  `Read the heading with text "How your donation helps kids like Eddy".`,
  `Read the heading with text "Early intervention".`,
  `Read the heading with text "Specialised training".`,
  `Read the heading with text "Occupational therapy".`,
  `Read the link with text "Donate now" and press it.`,
  `Read the heading with text "Give now to help share the magic with kids like Eddy this Christmas.".`,
  `Find the button with text "Step 1".`,
  `Find the button with text "Step 2".`,
  `Find the button with text "Step 3".`,
  `Find the tab panel with text "$65".`,
  `Find the tab panel with text "$120".`,
  `Read the text that starts with "can help provide critical early intervention support to families in the overwhel".`,
  `Find the tab panel with text "$275".`,
  `Find the textbox with label "Other Amount" and type "500".`,
  `Find the button with text "Next step" and press it.`,


  `Find the heading with text "Your Details".`,
  `Find the tab panel with text "Individual" and  "Organisation".`,
  `Find the tab panel with text "Individual" and press it.`,
  `Find the textbox with label "First Name *" and type "John".`,
  `Find the textbox with label "Email Address *" and type "john.doe@gmail.com".`,
  `Find the textbox with label "Please enter your street address" and type "1 George Street Robe South Australia 5276".`,
  `Find the textbox with label "Leave a message" and type "I'm donating to assist the low-vision and blind community.".`,
  `Find the checkbox with label "I'd like to remain anonymous" and check it.`,
  `Find the button with text "Next step" and press it.`,
  `Find the textbox with label "Last Name *", read the validation error message and type "Doe".`,
  `Find the button with text "Next step" and press it.`,




  `Find the heading with text "Payment details".`,
  `Find the textbox with label "Card number" and type "1234 1234 1234 1234".`,
  `Find the textbox with label "Expiration (MM/YY) MM / YY" and type "01 / 30".`,
  `Find the textbox with label "Security code" and type "123".`,
  `Find the dropdown with label "Country" and select "Australia".`,
  `Find the dropdown with label "Cover platform costs" and select "I don't wish to cover platform costs".`,
  `"Confirm the amount to be donate is 500 dollars".`,
  `Find the button with text "Donate now" and press it.`,
  `Find the textbox with label "Card number", read the validation error message and type "1234 1234 1234 1234".`,
  `Find the button with text "Donate now" and press it.`
];

{
  const rowNumber = 1;
  let numberOfNewRows = steps.length;

  const table = $0 as HTMLTableElement;

  if (table.nodeName.toUpperCase() !== 'TABLE') {
    alert('Please select a `table` element before proceeding.');
    throw Error(`Elemented selected isn't a \`table\` element.`);
  }

  const row = [...table.rows].at(rowNumber) as HTMLTableRowElement;
  const clones: HTMLTableRowElement[] = [];

  [...table.rows].slice(1).forEach(row => row.remove());

  while (numberOfNewRows--) {
    const clone = row?.cloneNode(true) as HTMLTableRowElement;
    clones.push(clone);
  }

  table.append(...clones);
}

{
  // Let `table` be a HTML table.
  // Let `column` be the column number in `table` whose cells will be visited to do something.
  const column = 2;

  const table = $0 as HTMLTableElement;

  if (table.nodeName.toUpperCase() !== 'TABLE') {
    alert('Please select a `table` element before proceeding.');
    throw Error(`Elemented selected isn't a \`table\` element.`);
  }

  const selector = `td:nth-child(${column})`;
  const cells = [...table.querySelectorAll(selector)] as HTMLTableCellElement[];

  // For each cell 'cell' in 'cells'.
  for (const cell of cells) {
    const step = steps.shift();

    if (step) {
      cell.textContent = step;
    }
    else {
      cell?.parentElement?.remove();
    }
  }
}