const data = [
  {
    id: "insureds",
    icon: "iconsminds-air-balloon-1",
    label: "menu.insureds",
    to: "/app/insureds/people",
    // subs: [
    //   {
    //     icon: "simple-icon-paper-plane",
    //     label: "menu.people",
    //     to: "/app/insureds/people"
    //   },
    //   {
    //     icon: "simple-icon-paper-plane",
    //     label: "menu.cases",
    //     to: "/app/insureds/cases"
    //   },
    //   {
    //     icon: "simple-icon-paper-plane",
    //     label: "menu.meta-field",
    //     to: "/app/insureds/meta-field"
    //   }
    // ]
  },
  {
    id: "fields",
    icon: "iconsminds-three-arrow-fork",
    label: "menu.fields",
    to: "/app/fields",
    subs: [
      {
        icon: "simple-icon-paper-plane",
        label: "menu.category",
        to: "/app/fields/category"
      },
      {
        icon: "simple-icon-paper-plane",
        label: "menu.meta-field",
        to: "/app/fields/meta-field"
      },
      {
        icon: "simple-icon-paper-plane",
        label: "menu.case-tag",
        to: "/app/fields/case-tag"
      }
    ]
  },
  {
      id: "logout",
      icon: "iconsminds-power-3",
      label: "menu.logout",
      to: "/user/login"
    }
  // {
  //   id: "blankpage",
  //   icon: "iconsminds-bucket",
  //   label: "menu.blank-page",
  //   to: "/app/blank-page"
  // },
  // {
  //   id: "docs",
  //   icon: "iconsminds-library",
  //   label: "menu.docs",
  //   to: "https://gogo-react-docs.coloredstrategies.com/",
  //   newWindow:true
  // }
];
export default data;
