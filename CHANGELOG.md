# Changelog

## [2.6.0](https://github.com/gravity-ui/navigation/compare/v2.5.0...v2.6.0) (2024-04-03)


### Features

* **AsideHeader:** hide collapse button ([#219](https://github.com/gravity-ui/navigation/issues/219)) ([290d920](https://github.com/gravity-ui/navigation/commit/290d920168ece85b88bd9adeff5d5cfb7b555925))

## [2.5.0](https://github.com/gravity-ui/navigation/compare/v2.4.2...v2.5.0) (2024-03-27)


### Features

* **CompositeBar:** use uikit ActionTooltip instead of Tooltip ([#217](https://github.com/gravity-ui/navigation/issues/217)) ([4673f8c](https://github.com/gravity-ui/navigation/commit/4673f8c5a584bce02e6f6a16fa7b86ab833a35d3))

## [2.4.2](https://github.com/gravity-ui/navigation/compare/v2.4.1...v2.4.2) (2024-03-27)


### Bug Fixes

* **AsideHeader:** move top-panel-height var to g-root ([#216](https://github.com/gravity-ui/navigation/issues/216)) ([424cba2](https://github.com/gravity-ui/navigation/commit/424cba28e623854a09fd0208937e68d13d9b07a0))
* **AsideHeader:** return css public read only var --gn-aside-top-panel-height ([#214](https://github.com/gravity-ui/navigation/issues/214)) ([69e4bf2](https://github.com/gravity-ui/navigation/commit/69e4bf2637afa616df2faff35fc93c4c38040dbb))

## [2.4.1](https://github.com/gravity-ui/navigation/compare/v2.4.0...v2.4.1) (2024-03-20)


### Bug Fixes

* **Logo:** remove aside header variables from logo ([#210](https://github.com/gravity-ui/navigation/issues/210)) ([8228ce3](https://github.com/gravity-ui/navigation/commit/8228ce3b210b960432859a2e49db99cd3d994975))

## [2.4.0](https://github.com/gravity-ui/navigation/compare/v2.3.1...v2.4.0) (2024-03-12)


### Features

* **Footer:** add footer components ([#207](https://github.com/gravity-ui/navigation/issues/207)) ([773d039](https://github.com/gravity-ui/navigation/commit/773d039f2472136f582c42923351454fb35e9b86))

## [2.3.1](https://github.com/gravity-ui/navigation/compare/v2.3.0...v2.3.1) (2024-03-04)


### Bug Fixes

* **logo:** make logo independent of the aside state ([#205](https://github.com/gravity-ui/navigation/issues/205)) ([78e2f09](https://github.com/gravity-ui/navigation/commit/78e2f09b37f13fe6b1fd2ef514c0fb07d81e7631))

## [2.3.0](https://github.com/gravity-ui/navigation/compare/v2.2.0...v2.3.0) (2024-02-22)


### Features

* **logo:** add target property ([#203](https://github.com/gravity-ui/navigation/issues/203)) ([c04e0f0](https://github.com/gravity-ui/navigation/commit/c04e0f0c2a98915ae107313edadd88494e628912))

## [2.2.0](https://github.com/gravity-ui/navigation/compare/v2.1.2...v2.2.0) (2024-02-20)


### Features

* **AsideHeader:** add current item to CSS API ([#194](https://github.com/gravity-ui/navigation/issues/194)) ([cdbdf6a](https://github.com/gravity-ui/navigation/commit/cdbdf6adc575d5ee9e69d4d4e2ac68320be52d2f))

## [2.1.2](https://github.com/gravity-ui/navigation/compare/v2.1.1...v2.1.2) (2024-02-19)


### Bug Fixes

* **MobileFooterItem:** make modalItem prop optional ([#200](https://github.com/gravity-ui/navigation/issues/200)) ([2c968b3](https://github.com/gravity-ui/navigation/commit/2c968b35cb4c4346313ecb77eb534e8742ae6746))

## [2.1.1](https://github.com/gravity-ui/navigation/compare/v2.1.0...v2.1.1) (2024-02-16)


### Bug Fixes

* **Item:** fix default css var ([#193](https://github.com/gravity-ui/navigation/issues/193)) ([5df8e2d](https://github.com/gravity-ui/navigation/commit/5df8e2d6ed09066eed2b7551a3e531f4f970c6b2))

## [2.1.0](https://github.com/gravity-ui/navigation/compare/v2.0.0...v2.1.0) (2024-02-15)


### Features

* **Logo:** export logo components ([#190](https://github.com/gravity-ui/navigation/issues/190)) ([f2dca3a](https://github.com/gravity-ui/navigation/commit/f2dca3aa2d531da9ffd26d96d773e88e14fe9c72))

## [2.0.0](https://github.com/gravity-ui/navigation/compare/v1.9.0...v2.0.0) (2024-02-12)


### ⚠ BREAKING CHANGES

* rename CSS API vars ([#186](https://github.com/gravity-ui/navigation/issues/186))
    * `--gn-aside-header-background-color` -> `--gn-aside-header-decoration-collapsed-background-color`, `--gn-aside-header-decoration-expanded-background-color`
    * `--gn-aside-header-divider-line-color` -> `--gn-aside-header-divider-vertical-color`, `--gn-aside-header-divider-horizontal-color`
    * `--gn-aside-header-collapse-button-divider-line-color` -> `--gn-aside-header-divider-horizontal-color`
    * `--gn-aside-header-subheader-item-icon-color`, `--gn-aside-header-footer-item-icon-color`-> `--gn-aside-header-general-item-icon-color`
    * `--gn-aside-header-menu-item-icon-color` -> `--gn-aside-header-item-icon-color`
* update uikit 6, components 2 and other deps ([#185](https://github.com/gravity-ui/navigation/issues/185))
* remove local configure, use uikit/i18n ([#177](https://github.com/gravity-ui/navigation/issues/177)) ([f39870f](https://github.com/gravity-ui/navigation/commit/f39870fd5f15373495bcfc2460559d3052725481))

### Features

* **AsideHeader:** support CSS API ([#182](https://github.com/gravity-ui/navigation/issues/182)) ([3328b09](https://github.com/gravity-ui/navigation/commit/3328b09dcc5b03722f8cf24eb7fe4f07425eefe0))

## [1.9.0](https://github.com/gravity-ui/navigation/compare/v1.8.4...v1.9.0) (2024-02-02)


### Features

* **Item:** added popupContentClassName prop ([#181](https://github.com/gravity-ui/navigation/issues/181)) ([38bfdd6](https://github.com/gravity-ui/navigation/commit/38bfdd60b3a108c7e5f90e67ad0eb27c52480e2b))


### Bug Fixes

* **MultipleTooltip:** changed tooltips and it's backdrop styles ([#179](https://github.com/gravity-ui/navigation/issues/179)) ([0a12da5](https://github.com/gravity-ui/navigation/commit/0a12da5064730be8dc134a8037e18a2d29cc0b4c))

## [1.8.4](https://github.com/gravity-ui/navigation/compare/v1.8.3...v1.8.4) (2024-01-24)


### Bug Fixes

* className for FirstPanel ([#174](https://github.com/gravity-ui/navigation/issues/174)) ([3d11be8](https://github.com/gravity-ui/navigation/commit/3d11be89a03695205d896410e8785be76501b59d))

## [1.8.3](https://github.com/gravity-ui/navigation/compare/v1.8.2...v1.8.3) (2023-12-21)


### Bug Fixes

* **CompositeBar:** remove NaN warning ([#171](https://github.com/gravity-ui/navigation/issues/171)) ([8b3857e](https://github.com/gravity-ui/navigation/commit/8b3857e31a9511e0954879eeb7bc71e47531f299))

## [1.8.2](https://github.com/gravity-ui/navigation/compare/v1.8.1...v1.8.2) (2023-12-19)


### Bug Fixes

* return mock in AsideHeaderContext ([#169](https://github.com/gravity-ui/navigation/issues/169)) ([873fb73](https://github.com/gravity-ui/navigation/commit/873fb731225071c281f5f0319c558be34acffc65))

## [1.8.1](https://github.com/gravity-ui/navigation/compare/v1.8.0...v1.8.1) (2023-12-14)


### Bug Fixes

* multiple tooltip backgroud styles precedence ([#167](https://github.com/gravity-ui/navigation/issues/167)) ([dd9ebc7](https://github.com/gravity-ui/navigation/commit/dd9ebc7c38c702c5daec1c2e725e8204f50639d9))

## [1.8.0](https://github.com/gravity-ui/navigation/compare/v1.7.0...v1.8.0) (2023-12-08)


### Features

* **AsideHeader:** add custom background ([#163](https://github.com/gravity-ui/navigation/issues/163)) ([f2226d9](https://github.com/gravity-ui/navigation/commit/f2226d96555ac4a42053693301d83c0b145e5bba))

## [1.7.0](https://github.com/gravity-ui/navigation/compare/v1.6.2...v1.7.0) (2023-11-27)


### Features

* add AsideFallback ([#161](https://github.com/gravity-ui/navigation/issues/161)) ([6e08a91](https://github.com/gravity-ui/navigation/commit/6e08a9188fd53d245c6f1c117099622e3ce755a8))

## [1.6.2](https://github.com/gravity-ui/navigation/compare/v1.6.1...v1.6.2) (2023-11-24)


### Bug Fixes

* global scroll with top panel and aside header ([#159](https://github.com/gravity-ui/navigation/issues/159)) ([cfe44e0](https://github.com/gravity-ui/navigation/commit/cfe44e0fe0beeb87ebf7855e6a9ac4a2f048ae8f))

## [1.6.1](https://github.com/gravity-ui/navigation/compare/v1.6.0...v1.6.1) (2023-11-23)


### Bug Fixes

* global scroll without top alert ([#157](https://github.com/gravity-ui/navigation/issues/157)) ([8648858](https://github.com/gravity-ui/navigation/commit/86488587eac075e1d0bcccc959e3bb7050805ed8))

## [1.6.0](https://github.com/gravity-ui/navigation/compare/v1.5.0...v1.6.0) (2023-11-23)


### Features

* aside header top alert ([#118](https://github.com/gravity-ui/navigation/issues/118)) ([efc4839](https://github.com/gravity-ui/navigation/commit/efc483966dafbd2cf28b5c4a39c5530532deea66))

## [1.5.0](https://github.com/gravity-ui/navigation/compare/v1.4.2...v1.5.0) (2023-11-21)


### Features

* **HotkeysPanel:** add clear button for the search input ([#154](https://github.com/gravity-ui/navigation/issues/154)) ([bb948cf](https://github.com/gravity-ui/navigation/commit/bb948cf2ad2cc39431371164ed0fa8c4507eaceb))

## [1.4.2](https://github.com/gravity-ui/navigation/compare/v1.4.1...v1.4.2) (2023-11-16)


### Bug Fixes

* **Settings:** fixed the Settings/Selection imports in index.ts ([#152](https://github.com/gravity-ui/navigation/issues/152)) ([1d28fda](https://github.com/gravity-ui/navigation/commit/1d28fdad11c412a907d85dd32ee04eca5e1f2b93))

## [1.4.1](https://github.com/gravity-ui/navigation/compare/v1.4.0...v1.4.1) (2023-11-14)


### Bug Fixes

* **CompositeBar/Item:** support itemWrapper icon for highlighted node ([#148](https://github.com/gravity-ui/navigation/issues/148)) ([6874ee1](https://github.com/gravity-ui/navigation/commit/6874ee1a0a18bc5cbcb64d5f674601199f6c034e))

## [1.4.0](https://github.com/gravity-ui/navigation/compare/v1.3.0...v1.4.0) (2023-11-13)


### Features

* **Settings:** Added selection feature to the Settings ([#145](https://github.com/gravity-ui/navigation/issues/145)) ([9cacfe2](https://github.com/gravity-ui/navigation/commit/9cacfe2a1a91b50f14a88dfa0c481a412a2ef644))

## [1.3.0](https://github.com/gravity-ui/navigation/compare/v1.2.0...v1.3.0) (2023-11-10)


### Features

* updated vertical divider ([#144](https://github.com/gravity-ui/navigation/issues/144)) ([1e7dc82](https://github.com/gravity-ui/navigation/commit/1e7dc8249fd869853eeabab45a08c306c95448de))

## [1.2.0](https://github.com/gravity-ui/navigation/compare/v1.1.3...v1.2.0) (2023-11-03)


### Features

* split AsideHeader to compound components ([#140](https://github.com/gravity-ui/navigation/issues/140)) ([1099f68](https://github.com/gravity-ui/navigation/commit/1099f6830b25ceb393e3a4b51d33f92bc5b16760))

## [1.1.3](https://github.com/gravity-ui/navigation/compare/v1.1.2...v1.1.3) (2023-10-24)


### Bug Fixes

* **MultipleTooltip:** disable layer ([#141](https://github.com/gravity-ui/navigation/issues/141)) ([65452a9](https://github.com/gravity-ui/navigation/commit/65452a9e7558b10288f31bd646785b8a05c4dcb3))

## [1.1.2](https://github.com/gravity-ui/navigation/compare/v1.1.1...v1.1.2) (2023-10-17)


### Bug Fixes

* **CompositeBar:** recalc mounted PopupPosition if compact mode changed ([#138](https://github.com/gravity-ui/navigation/issues/138)) ([56ac451](https://github.com/gravity-ui/navigation/commit/56ac451bebb55a8d8163fb9ccd38acb236f1eb99))

## [1.1.1](https://github.com/gravity-ui/navigation/compare/v1.1.0...v1.1.1) (2023-10-13)


### Bug Fixes

* **Settings:** extend description SettingsItem prop ([#136](https://github.com/gravity-ui/navigation/issues/136)) ([c285014](https://github.com/gravity-ui/navigation/commit/c285014fee69af84bfa207ba3e78dc5d6c61a49a))

## [1.1.0](https://github.com/gravity-ui/navigation/compare/v1.0.0...v1.1.0) (2023-10-10)


### Features

* **MenuItem:** extend tooltipText prop ([#133](https://github.com/gravity-ui/navigation/issues/133)) ([2c8a6bf](https://github.com/gravity-ui/navigation/commit/2c8a6bffece849e2fe8133ade7a3e23a76a7c683))

## [1.0.0](https://github.com/gravity-ui/navigation/compare/v0.23.3...v1.0.0) (2023-10-10)


### chore

* bump version ([80a67a7](https://github.com/gravity-ui/navigation/commit/80a67a7ff27ec3d026fa365bfb3fa15d59c9978e))

## [0.23.3](https://github.com/gravity-ui/navigation/compare/v0.23.2...v0.23.3) (2023-10-09)


### Bug Fixes

* **AsideHeader:** add --gn-aside-header-size css var ([#130](https://github.com/gravity-ui/navigation/issues/130)) ([5b9e5a0](https://github.com/gravity-ui/navigation/commit/5b9e5a05fdd5dc6a17491498c54d6c969e7c31e1))

## [0.23.2](https://github.com/gravity-ui/navigation/compare/v0.23.1...v0.23.2) (2023-10-09)


### Bug Fixes

* **AsideHeader:** change ref type ([#128](https://github.com/gravity-ui/navigation/issues/128)) ([a3274e8](https://github.com/gravity-ui/navigation/commit/a3274e8262a06cae8b54a0b2d220bce7a54a06b8))

## [0.23.1](https://github.com/gravity-ui/navigation/compare/v0.23.0...v0.23.1) (2023-10-06)


### Bug Fixes

* **Settings:** not-found state styles for mobile ([#126](https://github.com/gravity-ui/navigation/issues/126)) ([75d354b](https://github.com/gravity-ui/navigation/commit/75d354b20a9b50fdff6ff0ecfc1e7a236d5df837))

## [0.23.0](https://github.com/gravity-ui/navigation/compare/v0.22.2...v0.23.0) (2023-10-05)


### ⚠ BREAKING CHANGES

* **AsideHeader:** add ref prop for popup-anchor ([#123](https://github.com/gravity-ui/navigation/issues/123))

### Features

* **AsideHeader:** add ref prop for popup-anchor ([#123](https://github.com/gravity-ui/navigation/issues/123)) ([de2e3f4](https://github.com/gravity-ui/navigation/commit/de2e3f4fd094054b574d4b239a582bad37a3fef5))

## [0.22.2](https://github.com/gravity-ui/navigation/compare/v0.22.1...v0.22.2) (2023-10-04)


### Bug Fixes

* **AllPages:** fix stuck i18n ([#121](https://github.com/gravity-ui/navigation/issues/121)) ([f7879b3](https://github.com/gravity-ui/navigation/commit/f7879b3ddd361275c1d116efcb03f894b3a200ec))

## [0.22.1](https://github.com/gravity-ui/navigation/compare/v0.22.0...v0.22.1) (2023-10-02)


### Bug Fixes

* **AsideHeader:** return export AsideHeaderProps ([#119](https://github.com/gravity-ui/navigation/issues/119)) ([1ba6f85](https://github.com/gravity-ui/navigation/commit/1ba6f856479d22cb4330341a7164dee3e432e0cb))
* **CompositeBar:** fix stucking multipleTooltip ([#117](https://github.com/gravity-ui/navigation/issues/117)) ([be6534e](https://github.com/gravity-ui/navigation/commit/be6534e1a6f49dd8ce1e1dde1aba837b661baf19))

## [0.22.0](https://github.com/gravity-ui/navigation/compare/v0.21.1...v0.22.0) (2023-09-29)


### Features

* **all-pages-panel:** added all pages panel ([1ed3ba3](https://github.com/gravity-ui/navigation/commit/1ed3ba3a919c0902704a1e8ac7cf62ba401d35ab))
* **all-pages-panel:** added all pages panel ([#109](https://github.com/gravity-ui/navigation/issues/109)) ([1ed3ba3](https://github.com/gravity-ui/navigation/commit/1ed3ba3a919c0902704a1e8ac7cf62ba401d35ab))

## [0.21.1](https://github.com/gravity-ui/navigation/compare/v0.21.0...v0.21.1) (2023-09-28)


### Bug Fixes

* **CompositeBar/Item:** fix odd closing popup by click inside ([#114](https://github.com/gravity-ui/navigation/issues/114)) ([cec9812](https://github.com/gravity-ui/navigation/commit/cec9812a3db6824bd4f78877e4247523b020737f))

## [0.21.0](https://github.com/gravity-ui/navigation/compare/v0.20.0...v0.21.0) (2023-09-27)


### Features

* supported initial search in settings ([#112](https://github.com/gravity-ui/navigation/issues/112)) ([b858783](https://github.com/gravity-ui/navigation/commit/b858783fcced5df0339f279f4bb05a687270b5a1))

## [0.20.0](https://github.com/gravity-ui/navigation/compare/v0.19.0...v0.20.0) (2023-09-27)


### Features

* added right adornments for settings items ([#110](https://github.com/gravity-ui/navigation/issues/110)) ([fe14e64](https://github.com/gravity-ui/navigation/commit/fe14e64f7423df8f12d881c7347d51c5d0469aff))

## [0.19.0](https://github.com/gravity-ui/navigation/compare/v0.18.1...v0.19.0) (2023-09-26)


### Features

* added exports for settings props ([#107](https://github.com/gravity-ui/navigation/issues/107)) ([a3fc62f](https://github.com/gravity-ui/navigation/commit/a3fc62f80fae51e3bc52103857706a583b5f8e6a))

## [0.18.1](https://github.com/gravity-ui/navigation/compare/v0.18.0...v0.18.1) (2023-09-22)


### Bug Fixes

* **Drawer:** fix animation ([#105](https://github.com/gravity-ui/navigation/issues/105)) ([45d57c2](https://github.com/gravity-ui/navigation/commit/45d57c2ddf3a76a06987849fdcae9fcadc693543))

## [0.18.0](https://github.com/gravity-ui/navigation/compare/v0.17.0...v0.18.0) (2023-09-21)


### Features

* **AsideHeader:** move openModalSubscriber prop to AsideHeader ([#103](https://github.com/gravity-ui/navigation/issues/103)) ([69ad527](https://github.com/gravity-ui/navigation/commit/69ad5278321e16c06331e3f166f47fbe8176049b))

## [0.17.0](https://github.com/gravity-ui/navigation/compare/v0.16.0...v0.17.0) (2023-09-08)


### ⚠ BREAKING CHANGES

* Change defaults for `AsideHeader` ([#99](https://github.com/gravity-ui/navigation/issues/99))
  * ASIDE_HEADER_ICON_SIZE = 18px
  * Change subheader and footer icons color. `--g-color-text-misc` -> `--g-color-text-primary`
* Add prefix to css vars ([#99](https://github.com/gravity-ui/navigation/issues/99))
  * `--aside-header-background-color` -> `--gn-aside-header-background-color`
  * `--aside-header-collapse-button-divider-line-color` -> `--gn-aside-header-collapse-button-divider-line-color`
  * `--aside-header-divider-line-color` -> `--gn-aside-header-divider-line-color`
  * `--aside-header-header-divider-line-color` -> `--gn-aside-header-subheader-divider-line-color`

Read more about [themization](https://github.com/gravity-ui/navigation#css-variables)

### Features

* **AsideHeader:** support highlighted item ([#97](https://github.com/gravity-ui/navigation/issues/97)) ([f8c06a1](https://github.com/gravity-ui/navigation/commit/f8c06a176ab7e48369931b5bf6e0f0fef69ce227))
* change defaults, add prefix to css vars ([#99](https://github.com/gravity-ui/navigation/issues/99)) ([08a812a](https://github.com/gravity-ui/navigation/commit/08a812a216c12385505c492cbfdcb4c3078498a2))


### Bug Fixes

* **CompositeBar:** fix multipleTooltip sticking ([#100](https://github.com/gravity-ui/navigation/issues/100)) ([420bd6e](https://github.com/gravity-ui/navigation/commit/420bd6ee24a7a23091322e8d43e7d9cc4a4ad7b8))

## [0.16.0](https://github.com/gravity-ui/navigation/compare/v0.15.0...v0.16.0) (2023-08-23)


### ⚠ BREAKING CHANGES

* support configure ([#95](https://github.com/gravity-ui/navigation/issues/95))

### Features

* support configure ([#95](https://github.com/gravity-ui/navigation/issues/95)) ([c0140a7](https://github.com/gravity-ui/navigation/commit/c0140a730107ec28cb674637d15f0f07713a52e8))

## [0.15.0](https://github.com/gravity-ui/navigation/compare/v0.14.0...v0.15.0) (2023-08-21)


### Features

* **AsideHeader/SubheaderItem:** support popup props ([#89](https://github.com/gravity-ui/navigation/issues/89)) ([64f24e9](https://github.com/gravity-ui/navigation/commit/64f24e939597e66d45f010d182f452b7b0f29695))

## [0.14.0](https://github.com/gravity-ui/navigation/compare/v0.13.1...v0.14.0) (2023-08-18)


### ⚠ BREAKING CHANGES

* rename CSS namespace ([#87](https://github.com/gravity-ui/navigation/issues/87))

### Features

* rename CSS namespace ([#87](https://github.com/gravity-ui/navigation/issues/87)) ([0b3bcc9](https://github.com/gravity-ui/navigation/commit/0b3bcc9cc0b097bed4b0cd90d5da0bdbea00fda1))


### Bug Fixes

* remove reexport configure temporary ([#90](https://github.com/gravity-ui/navigation/issues/90)) ([e414e2a](https://github.com/gravity-ui/navigation/commit/e414e2a17d9cef17d368af2c9ebf2d2831870616))
* **storybook:** after hide reexport configure ([#92](https://github.com/gravity-ui/navigation/issues/92)) ([727086e](https://github.com/gravity-ui/navigation/commit/727086e7c5a28e4094e4018e37263d38bc9703dd))

## [0.13.1](https://github.com/gravity-ui/navigation/compare/v0.13.0...v0.13.1) (2023-08-17)


### Bug Fixes

* **Logo:** revive href prop ([#85](https://github.com/gravity-ui/navigation/issues/85)) ([59b2d69](https://github.com/gravity-ui/navigation/commit/59b2d6962357f40d0b76d3e83e2eac868d574be8))

## [0.13.0](https://github.com/gravity-ui/navigation/compare/v0.12.0...v0.13.0) (2023-08-17)


### Features

* **Item:** add ref to itemWrapper options ([#84](https://github.com/gravity-ui/navigation/issues/84)) ([1f3be59](https://github.com/gravity-ui/navigation/commit/1f3be59f0820f85c10d4d65db9ebabf1d6826033))
* supported onClickCapture in Item and FooterItem ([#82](https://github.com/gravity-ui/navigation/issues/82)) ([4646563](https://github.com/gravity-ui/navigation/commit/4646563ebe9b7c64164c00518d724f115865ab8a))

## [0.12.0](https://github.com/gravity-ui/navigation/compare/v0.11.1...v0.12.0) (2023-08-15)


### Features

* added AsideHeaderContext ([#79](https://github.com/gravity-ui/navigation/issues/79)) ([4bac263](https://github.com/gravity-ui/navigation/commit/4bac2630d6ee004880754bbdf7a86438b27e86d8))
* supported events in onClick callbacks ([#81](https://github.com/gravity-ui/navigation/issues/81)) ([a861031](https://github.com/gravity-ui/navigation/commit/a861031e473aca03898d10de0c763cc1990a6664))

## [0.11.1](https://github.com/gravity-ui/navigation/compare/v0.11.0...v0.11.1) (2023-07-26)


### Bug Fixes

* fix build ([#77](https://github.com/gravity-ui/navigation/issues/77)) ([b8f8ef5](https://github.com/gravity-ui/navigation/commit/b8f8ef591998fae8ef51118aaaa1d1c1f73a1ea9))
* workflow main-preview ([#75](https://github.com/gravity-ui/navigation/issues/75)) ([e148bdd](https://github.com/gravity-ui/navigation/commit/e148bddb056883b2bfba48094f907ae20e563c7f))

## [0.11.0](https://github.com/gravity-ui/navigation/compare/v0.10.1...v0.11.0) (2023-07-26)


### ⚠ BREAKING CHANGES

* migration on uikit 5 ([#71](https://github.com/gravity-ui/navigation/issues/71))

### Features

* migration on uikit 5 ([#71](https://github.com/gravity-ui/navigation/issues/71)) ([a032d42](https://github.com/gravity-ui/navigation/commit/a032d4293a899a058487ea12205d8dff1342f6a3))

## [0.10.1](https://github.com/gravity-ui/navigation/compare/v0.10.0...v0.10.1) (2023-07-26)


### Bug Fixes

* **CompositeBar:** problem with not working onItemClick prop ([#72](https://github.com/gravity-ui/navigation/issues/72)) ([59d4c3d](https://github.com/gravity-ui/navigation/commit/59d4c3d72fd4a95f5f6b41b2b84444184b89d3a1))

## [0.10.0](https://github.com/gravity-ui/navigation/compare/v0.9.0...v0.10.0) (2023-07-25)


### Features

* added MultipleTooltip ([#69](https://github.com/gravity-ui/navigation/issues/69)) ([ab35916](https://github.com/gravity-ui/navigation/commit/ab35916366457a1bc8cd81cd8c6d9811d3f2d82c))
* **CompositeBar:** rewritten to FC ([#67](https://github.com/gravity-ui/navigation/issues/67)) ([78f43b0](https://github.com/gravity-ui/navigation/commit/78f43b04c8eaa155a44e6953130476a85d0a4b40))
* **Item:** forward event to onItemClick ([#70](https://github.com/gravity-ui/navigation/issues/70)) ([ac571dc](https://github.com/gravity-ui/navigation/commit/ac571dca9cfec5fb3d919fee3a3cd4744c52a8e1))

## [0.9.0](https://github.com/gravity-ui/navigation/compare/v0.8.1...v0.9.0) (2023-07-04)


### Features

* added new stories for ActionBar ([#64](https://github.com/gravity-ui/navigation/issues/64)) ([96dbcf3](https://github.com/gravity-ui/navigation/commit/96dbcf39863aea6ea781a224636b4abc6f5a64e5))
* added type exports for ActionBar ([#66](https://github.com/gravity-ui/navigation/issues/66)) ([f911bd6](https://github.com/gravity-ui/navigation/commit/f911bd645aad36b453c7a9c49974f0bc790bea5d))

## [0.8.1](https://github.com/gravity-ui/navigation/compare/v0.8.0...v0.8.1) (2023-06-23)


### Bug Fixes

* **MobileHeader:** add export ([#61](https://github.com/gravity-ui/navigation/issues/61)) ([15523f5](https://github.com/gravity-ui/navigation/commit/15523f5e114cc5d2f9842775ce064a9f9b1daa86))

## [0.8.0](https://github.com/gravity-ui/navigation/compare/v0.7.0...v0.8.0) (2023-06-09)


### Features

* **Title:** add component ([#58](https://github.com/gravity-ui/navigation/issues/58)) ([17cfa36](https://github.com/gravity-ui/navigation/commit/17cfa362c4394aa8e72c67f1e9abea92c5102fe8))

## [0.7.0](https://github.com/gravity-ui/navigation/compare/v0.6.1...v0.7.0) (2023-06-08)


### Features

* **CompositeBar/Item:** add popupKeepMounted prop ([#55](https://github.com/gravity-ui/navigation/issues/55)) ([88140e8](https://github.com/gravity-ui/navigation/commit/88140e8bcfa9c86aeb0c6d45770eb545fb23a589))
* **HotkeysPanel:** add component ([#53](https://github.com/gravity-ui/navigation/issues/53)) ([86c59bd](https://github.com/gravity-ui/navigation/commit/86c59bdb09bde48ba3588abfdb14e8219c9a902c))


### Bug Fixes

* **Logo:** disable hover animation on button ([#54](https://github.com/gravity-ui/navigation/issues/54)) ([99f2787](https://github.com/gravity-ui/navigation/commit/99f2787dfa39b04e160a0517e5555408f584971d))

## [0.6.1](https://github.com/gravity-ui/navigation/compare/v0.6.0...v0.6.1) (2023-06-07)


### Bug Fixes

* **FooterItem:** fix button area ([#50](https://github.com/gravity-ui/navigation/issues/50)) ([4e6904d](https://github.com/gravity-ui/navigation/commit/4e6904df4f650c80d5587edc6361b766fcd29e57))

## [0.6.0](https://github.com/gravity-ui/navigation/compare/v0.5.0...v0.6.0) (2023-06-07)


### Features

* **AsideHeader:** add headerDecoration prop ([#49](https://github.com/gravity-ui/navigation/issues/49)) ([2e98c65](https://github.com/gravity-ui/navigation/commit/2e98c65033f221d7085af735d214fc8e6d22bc8a))
* **SettingsMenuMobile:** add component ([#47](https://github.com/gravity-ui/navigation/issues/47)) ([092b6c4](https://github.com/gravity-ui/navigation/commit/092b6c4c995ff7f448623de435757d64fca948d4))

## [0.5.0](https://github.com/gravity-ui/navigation/compare/v0.4.0...v0.5.0) (2023-05-11)


### Features

* support React 18 in peerDeps ([#44](https://github.com/gravity-ui/navigation/issues/44)) ([400db16](https://github.com/gravity-ui/navigation/commit/400db1601773a1d35f785d4d3adfabea762307d6))

## [0.4.0](https://github.com/gravity-ui/navigation/compare/v0.3.2...v0.4.0) (2023-03-06)


### Features

* use uikit Tooltip ([#42](https://github.com/gravity-ui/navigation/issues/42)) ([2de0cac](https://github.com/gravity-ui/navigation/commit/2de0cac90c730f40ab41c49312bdd367c4f9cada))


### Bug Fixes

* updated README.md storybook link ([#40](https://github.com/gravity-ui/navigation/issues/40)) ([511abd9](https://github.com/gravity-ui/navigation/commit/511abd9f1051b361e5918d91eaaf3bb1af65f2d3))

## [0.3.2](https://github.com/gravity-ui/navigation/compare/v0.3.1...v0.3.2) (2023-02-17)


### Bug Fixes

* **AsideHeader:** panel border in High Contrast themes ([#37](https://github.com/gravity-ui/navigation/issues/37)) ([340f9bb](https://github.com/gravity-ui/navigation/commit/340f9bb5b728fe9757e9f9db26669f12e3770ae9))
* **Logo:** close panels by logo click ([#39](https://github.com/gravity-ui/navigation/issues/39)) ([860e8b2](https://github.com/gravity-ui/navigation/commit/860e8b29408ed5eba0880f0ebc63e2e6551ded4d))

## [0.3.1](https://github.com/gravity-ui/navigation/compare/v0.3.0...v0.3.1) (2022-12-29)


### Bug Fixes

* keep svg viewbox ([#33](https://github.com/gravity-ui/navigation/issues/33)) ([0205630](https://github.com/gravity-ui/navigation/commit/020563098e5e1d8187f2d2c62e7ef9af4d4085eb))

## [0.3.0](https://github.com/gravity-ui/navigation/compare/v0.2.1...v0.3.0) (2022-11-24)


### ⚠ BREAKING CHANGES

* Type of FooterItemProps.item.itemWrapper is changed ([df865df](https://github.com/gravity-ui/navigation/commit/df865df329f6c1e62c09063cdbf1596e634e8145))


### Bug Fixes

* footer items should be in bottom even if menuItems is empty ([d55e55e](https://github.com/gravity-ui/navigation/commit/d55e55e267be989b2f94d552476f21c116af9489))

## [0.2.1](https://github.com/gravity-ui/navigation/compare/v0.2.0...v0.2.1) (2022-10-31)


### Bug Fixes

* types declaration dir ([#27](https://github.com/gravity-ui/navigation/issues/27)) ([6840db8](https://github.com/gravity-ui/navigation/commit/6840db839a13ac77b13d11c06907b6fff52b4845))

## [0.2.0](https://github.com/gravity-ui/navigation/compare/v0.1.0...v0.2.0) (2022-10-31)


### Features

* add Settings component ([b7ad550](https://github.com/gravity-ui/navigation/commit/b7ad550825d5cc0ac416b57d0c35f6ccd459793d))


### Bug Fixes

* component AsideHeader should be stateless ([e2cbd15](https://github.com/gravity-ui/navigation/commit/e2cbd15921d051aada9246f27f34c60ca8169ec9))
* onClosePanel should be called before onItemClick ([8d0acb5](https://github.com/gravity-ui/navigation/commit/8d0acb5603129817aea929f881f85a264b074fe7))
* package-lock.json ([#26](https://github.com/gravity-ui/navigation/issues/26)) ([14f012e](https://github.com/gravity-ui/navigation/commit/14f012eeda4f97bbd0e4e48e7b83bf195cb3c0ab))
* set z-index for .ycn-aside-header__content ([b793bc6](https://github.com/gravity-ui/navigation/commit/b793bc63ca760f608a4f5f2961af1947b0972fc2))
* sticky-element should not be restrict by an extra parent element ([5ecfac3](https://github.com/gravity-ui/navigation/commit/5ecfac3da2b390255485aef63718b6a2c4c4a8c0))

## [0.1.0](https://github.com/gravity-ui/navigation/compare/v0.0.7...v0.1.0) (2022-10-17)


### Features

* add ActionBar component ([#19](https://github.com/gravity-ui/navigation/issues/19)) ([595d418](https://github.com/gravity-ui/navigation/commit/595d4189f005615e4ba504cef4689d48fb6a798a))
* **CompositeBar:** divider item type ([#11](https://github.com/gravity-ui/navigation/issues/11)) ([89f3b85](https://github.com/gravity-ui/navigation/commit/89f3b854ac9348837352809101502a876def8940))

## [0.0.7](https://github.com/gravity-ui/navigation/compare/v0.0.6...v0.0.7) (2022-10-11)


### Bug Fixes

* package bundling ([#16](https://github.com/gravity-ui/navigation/issues/16)) ([9987afb](https://github.com/gravity-ui/navigation/commit/9987afb3c2a98ef79dc36d40f08070b4a96c6882))

## [0.0.6](https://github.com/gravity-ui/navigation/compare/v0.0.5...v0.0.6) (2022-10-11)


### Bug Fixes

* import svg ([#14](https://github.com/gravity-ui/navigation/issues/14)) ([91ea13f](https://github.com/gravity-ui/navigation/commit/91ea13ff3b199bbbcc3ddd2472a6b91d2b76b453))

## [0.0.5](https://github.com/gravity-ui/navigation/compare/v0.0.4...v0.0.5) (2022-10-11)


### Bug Fixes

* add prepublishOnly script to package.json ([#12](https://github.com/gravity-ui/navigation/issues/12)) ([9dd3b74](https://github.com/gravity-ui/navigation/commit/9dd3b746de5339108da419b52479de16677e80f8))

## [0.0.4](https://github.com/gravity-ui/navigation/compare/v0.0.3...v0.0.4) (2022-10-10)


### Bug Fixes

* fix typo in props name ([#8](https://github.com/gravity-ui/navigation/issues/8)) ([c1292e3](https://github.com/gravity-ui/navigation/commit/c1292e391fc9a01f324b0cb4192a331d1f116822))

## [0.0.3](https://github.com/gravity-ui/navigation/compare/v0.0.2...v0.0.3) (2022-09-30)


### Features

* Transfer remaining components ([#4](https://github.com/gravity-ui/navigation/issues/4)) ([70b7d5e](https://github.com/gravity-ui/navigation/commit/70b7d5edd9fddea94ac087f3fd6269753ad3e5fc))

## [0.0.2](https://github.com/gravity-ui/navigation/compare/v0.0.1...v0.0.2) (2022-09-28)


### Bug Fixes

* package name ([#2](https://github.com/gravity-ui/navigation/issues/2)) ([0aa4f2f](https://github.com/gravity-ui/navigation/commit/0aa4f2f8b57d3ee5192b6e9cd088796e007274d9))

## 0.0.1 (2022-09-27)


### chore

* initial release ([eabd12e](https://github.com/gravity-ui/navigation/commit/eabd12ed9eb46663ae58a8c3f9eaa7f4c59495ba))
