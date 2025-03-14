import React from "react";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import Constants from "@/data/Constants";
import { dracula } from "@codesandbox/sandpack-themes";
function CodeEditor({ code, isReady }: any) {
  return (
    <div>
      {isReady ? (
        <Sandpack
          template="react"
          theme={dracula}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            showNavigator: true,
            showLineNumbers: true,
            showTabs: true,
            editorHeight: 600,
          }}
          customSetup={{
            dependencies: {
              ...Constants.DEPENDANCY,
            },
          }}
          files={{
            "/App.js": `${code}`,
          }}
        />
      ) : (
        <SandpackProvider
          template="react"
          theme={dracula}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
          files={{
            "/app.js": {
              code: `${code}`,
              active: true,
            },
          }}
          customSetup={{
            dependencies: {
              ...Constants.DEPENDANCY,
            },
          }}
        >
          <SandpackLayout>
            <SandpackCodeEditor
              showLineNumbers={true}
              showTabs={true}
              style={{
                height: "600px",
              }}
            />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      )}
    </div>
  );
}

export default CodeEditor;
