export const removeAccents = (str: string) => {
  const AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];

  for (let i = 0; i < AccentsMap.length; i++) {
    const re = new RegExp("[" + AccentsMap[i]!.substr(1) + "]", "g");
    const char = AccentsMap[i]![0];
    str = str.replace(re, char!);
  }

  return str;
};

export const formatVideoTime = (seconds: number) => {
  try {
    const date = new Date(0);
    date.setSeconds(seconds);
    const time = date.toISOString().slice(11, 19);
    const result = time.startsWith("00:0")
      ? time.slice(4)
      : time.startsWith("00")
      ? time.slice(3)
      : time.length === 8 && time.startsWith("0")
      ? time.slice(1)
      : time;
    return result;
  } catch (error) {
    return "0:00";
  }
};

export const providers = [
  {
    icon: "/share-icon/facebook.svg",
    link: (url: string, title: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&t=${title}`,
    name: "Facebook",
  },
  {
    icon: "/share-icon/twitter.svg",
    link: (url: string, title: string) =>
      `http://twitter.com/share?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
    name: "Twitter",
  },
  {
    icon: "/share-icon/reddit.svg",
    link: (url: string, title: string) =>
      `http://www.reddit.com/submit?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
    name: "Reddit",
  },
  {
    icon: "/share-icon/email.svg",
    link: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${url}`,
    name: "Email",
  },
];

export const copyToClipboard = (text: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res: any, rej: any) => {
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  } catch (error) {
    console.error(error);
  }
};
