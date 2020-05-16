import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { rgba } from 'polished'

const Change = styled.span`
  border-radius: ${ ({ theme }) => theme.radii.round };
  padding: 0.2em 0.5em;
  font-weight: 700;
  letter-spacing: -0.4px;

  ${({ criteria }) =>
    criteria === 'positive'
      ? css`
        background-color: ${ ({ theme }) => theme.color.green[1] };
        color: ${ ({ theme }) => theme.color.green[0] };
        box-shadow: 0 0 0 2px ${ ({ theme }) => rgba(theme.color.green[1], 0.3) }
      `
      : css`
        background-color: ${ ({ theme }) => theme.color.red[1] };
        color: ${ ({ theme }) => theme.color.red[0] };
        box-shadow: 0 0 0 2px  ${ ({ theme }) => rgba(theme.color.red[1], 0.3) };
      `
    }
`

Change.propTypes = {
  criteria: PropTypes.oneOf(['positive', 'negative'])
}

export default Change
