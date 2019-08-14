// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {width:400, height:380});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async(msg) => {

  await figma.loadFontAsync({ family: "Roboto", style: "Regular" })
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  
  if (msg.type === 'getCurrentSelectedFrame') {
    if (figma.currentPage.selection.length === 0){
      figma.ui.postMessage("no selection");
    }
    else{
      var foundFrame = false;
      for (const node of figma.currentPage.selection) {
        if (node.type === "FRAME" && !foundFrame) {

          figma.currentPage.selection = [];

          //create the cover page
          var clonePage = figma.currentPage.clone();
          clonePage.name = "Cover Page";          
          
          for (const node2 of clonePage.children){
            node2.remove();
          }

          const coverFrameOnPage = figma.createFrame();
          coverFrameOnPage.name = "Cover Art";
          coverFrameOnPage.backgrounds = [{ type: 'SOLID', color: {r: 0.898, g: 0.898, b: 0.898} }];
          coverFrameOnPage.x = 0;
          coverFrameOnPage.y = 0;
          coverFrameOnPage.resizeWithoutConstraints(620,320);          

          const coverTextOnPage = figma.createText();
          coverTextOnPage.x = 0;
          coverTextOnPage.y = 16;
          coverTextOnPage.resizeWithoutConstraints(coverFrameOnPage.width, 57);
          coverTextOnPage.characters = "Cover Text";
          coverTextOnPage.textAlignHorizontal = "CENTER";
          coverTextOnPage.fontSize = 48;
          coverTextOnPage.fills = [{ type: 'SOLID', color: {r: 0, g: 0, b: 0} }];

          coverFrameOnPage.appendChild(coverTextOnPage);

          //var cloneCoverFrameOnPage = coverFrameOnPage.clone();
          //var cloneCoverTextOnPage = coverTextOnPage.clone();

          var clone = node.clone();
          //clone.name = "Cover Art";
          clone.clipsContent = true;

          //var ratio = clone.width / clone.height;
          //clone.resize(414,(414 * ratio));   
          clone.x = coverFrameOnPage.width/2 - clone.width/2;
          clone.y = 105;

          figma.group(clone.children, clone);
          
          coverFrameOnPage.insertChild(0, clone);    
          clonePage.appendChild(coverFrameOnPage);

          figma.root.insertChild(0, clonePage);

          figma.currentPage = clonePage;

          foundFrame = true;

          

          figma.ui.postMessage("cover page created");
        }
      }
      if (!foundFrame){
        figma.ui.postMessage("not frame");
      }
    }
    
  }
  
};