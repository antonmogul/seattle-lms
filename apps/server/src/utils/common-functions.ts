import { FileUpload } from "src/types/file-upload";

export function randomFourDigitNumber() {
  const val = Math.floor(1000 + Math.random() * 9000);
  return val;
}

export const getFileSize = (
  createReadStream: FileUpload["createReadStream"]
): Promise<number> =>
  new Promise((resolves, rejects) => {
    let filesize = 0;
    let stream = createReadStream();
    stream.on("data", (chunk: string | any[]) => {
      filesize += chunk.length;
    });
    stream.on("end", () => resolves(filesize));
    stream.on("error", rejects);
  });

export function validateFileExtension(
  filename: string,
  allowedExtensions: string[]
) {
  const regex = new RegExp(
    "([a-zA-Z0-9s_\\.-:])+(" +
      allowedExtensions.join("|") +
      ")$"
  );
  if (!regex.test(filename.toLowerCase())) {
    throw new Error(
      "Please upload files having extensions: " +
        allowedExtensions.join(", ") +
        " only."
    );
  }
}

export function parseDate(ISODateString) {
  const splittedDate = ISODateString.split("T")[0].split("-");
  return new Date(parseInt(splittedDate[0]), parseInt(splittedDate[1])-1, parseInt(splittedDate[2]))
}

export const maskEmail = (
  emailAddress: string
) => {
  let emailArr: string[];
  emailArr = emailAddress.split('');
  let finalArr=[];
  let len = emailArr.indexOf('@');
  emailArr.forEach((item, pos) => {
    (pos>=2 && pos<=len-3) ? finalArr.push('*') : finalArr.push(emailArr[pos]);
  })
  return finalArr.join('');
};

