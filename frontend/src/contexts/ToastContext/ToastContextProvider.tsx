import { Toast } from "flowbite-react/components/Toast";
import { ReactNode, useState } from "react";
import { ToastContext, ToastType } from "./ToastContext";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

export const ToastContextProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<string>();
  const [type, setType] = useState<ToastType>();

  return (
    <ToastContext.Provider
      value={{
        showToast: (params: { content: string; type: ToastType }) => {
          setContent(params.content);
          setType(params.type);
        },
      }}
    >
      {children}
      {content && (
        <div className="absolute bottom-0 right-0 m-16">
          <Toast duration={100}>
            {type == "success" ? (
              <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="size-5" />
              </div>
            ) : type == "failure" ? (
              <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiX className="size-5" />
              </div>
            ) : type == "warning" ? (
              <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                <HiExclamation className="size-5" />
              </div>
            ) : null}
            <div className="ml-3 text-sm font-normal">{content}</div>
            <Toast.Toggle onClick={() => setContent(undefined)}/>
          </Toast>
        </div>
      )}
    </ToastContext.Provider>
  );
};
